/* @layer renderer-shell @kind logic */
import type { CoreCalls, PortDefinition } from '../../port/port-definition.type';
import type { EmscriptenModule } from './emscripten.type';
import type { CoreBoot, CoreLog, GameCore } from './game-core.type';
import { IDLE_STATE } from './game-core.constants';
import { bootCore } from './boot-core';
import { createCoreCalls } from './create-core-calls';
import { createCoreControls } from './create-core-controls';
import { createStateHub } from './create-state-hub';
import { teardownCore } from './teardown-core';
import { watchCoreCrash } from './watch-core-crash';

const messageOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const createGameCore = <S>(definition: PortDefinition<S>): GameCore<S> => {
  const { exports } = definition.core;
  const hub = createStateHub();
  let mod: EmscriptenModule | null = null;
  let calls: CoreCalls | null = null;
  let generation = 0;
  let unwatch: (() => void) | null = null;
  let log: CoreLog = () => undefined;

  const fail = (message: string): void => hub.set({ status: 'error', error: message });

  const isLive = (): boolean => ['loading', 'running', 'paused'].includes(hub.get().status);

  const adopt = (booted: EmscriptenModule, headless: boolean): void => {
    mod = booted;
    calls = createCoreCalls(booted);
    if (headless && exports.initHeadless) calls.call(exports.initHeadless);
    unwatch = watchCoreCrash(fail);
    hub.set({ status: 'running', error: null });
  };

  const launch = async (boot: CoreBoot, headless: boolean): Promise<void> => {
    if (isLive()) return;
    generation += 1;
    const mine = generation;
    log = boot.log ?? log;
    hub.set({ status: 'loading', error: null });
    try {
      const booted = await bootCore(definition, boot, headless);
      if (mine === generation) adopt(booted, headless);
      else teardownCore(booted, exports, log);
    } catch (error) {
      if (mine === generation) fail(messageOf(error));
    }
  };

  const stop = (): void => {
    generation += 1;
    unwatch?.();
    unwatch = null;
    if (mod) teardownCore(mod, exports, log);
    mod = null;
    calls = null;
    hub.set(IDLE_STATE);
  };

  return {
    ...createCoreControls(hub, () => calls, exports),
    definition,
    start: (boot) => launch(boot, false),
    initHeadless: (boot) => launch(boot, true),
    stop,
    calls: () => calls,
    fs: () => mod?.FS ?? null,
    module: () => mod,
    state: hub.get,
    subscribe: hub.subscribe,
  };
};

export { createGameCore };
