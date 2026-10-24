/* @layer electron-main @kind logic */
import { app } from 'electron';
import type { BridgeServer } from './bridge.type';
import type { AppBridge, AppBridgeInput, AppBridgeOptions, OpenedAppBridge } from './app-bridge.type';
import { BRIDGE_STALE_OPEN } from './bridge.constants';
import { appBridgeFile } from './app-bridge-file';
import { startAppBridge } from './start-app-bridge';

const createAppBridge = (input: AppBridgeInput): AppBridge => {
  const state = {
    generation: 0,
    chain: Promise.resolve() as Promise<unknown>,
    opening: null as Promise<BridgeServer> | null,
    opened: null as OpenedAppBridge | null,
    hooked: false,
  };
  appBridgeFile.current = input.file;
  const close = (): void => {
    state.generation += 1;
    state.opened?.stop();
    state.opened = null;
    state.opening = null;
  };
  const hook = (): void => {
    if (state.hooked) return;
    state.hooked = true;
    app.once('will-quit', close);
    process.once('exit', close);
  };
  const start = async (generation: number, options: AppBridgeOptions): Promise<BridgeServer> => {
    const isCurrent = (): boolean => generation === state.generation;
    if (!isCurrent()) throw new Error(BRIDGE_STALE_OPEN);
    const opened = await startAppBridge(input.ctx(), options, { file: input.file(), isCurrent });
    if (!isCurrent()) {
      opened.stop();
      throw new Error(BRIDGE_STALE_OPEN);
    }
    state.opened = opened;
    return opened.server;
  };
  return {
    open: (options) => {
      if (state.opening) return state.opening;
      const chosen = options ?? input.options;
      if (!chosen) return Promise.reject(new Error('ctx.bridge.open needs options, or a bridge option on bootstrapApp'));
      hook();
      const generation = state.generation;
      const opening = state.chain.then(() => start(generation, chosen));
      state.chain = opening.catch(() => undefined);
      state.opening = opening;
      opening.catch(() => {
        if (state.opening === opening) state.opening = null;
      });
      return opening;
    },
    close,
    current: () => state.opened?.server ?? null,
    discoveryFile: input.file,
  };
};

export { createAppBridge };
