/* @layer electron-main @kind logic */
import { app } from 'electron';
import type { BridgeServer } from './bridge.type';
import type { AppBridge, AppBridgeInput, OpenedAppBridge } from './app-bridge.type';
import { appBridgeFile } from './app-bridge-file';
import { startAppBridge } from './start-app-bridge';

const createAppBridge = (input: AppBridgeInput): AppBridge => {
  const state = { generation: 0, opening: null as Promise<BridgeServer> | null, opened: null as OpenedAppBridge | null, hooked: false };
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
  const start = async (generation: number, options: NonNullable<AppBridgeInput['options']>): Promise<BridgeServer> => {
    const opened = await startAppBridge(input.ctx(), options, input.file());
    if (generation !== state.generation) {
      opened.stop();
      throw new Error('the bridge was closed while it opened');
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
      const opening = start(state.generation, chosen);
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
