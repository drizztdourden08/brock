/* @layer electron-main @kind logic */
import { memoByContext } from '@drizztdourden08/brock-electron/context';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { InputMain, InputOptions, InputRuntime } from './input-main.type';
import { createCalibrationStore } from '../calibration/calibration-store';
import { createInputRuntime } from './create-input-runtime';
import { INPUT_LIVE_FLAG } from './pad-lock.constants';
import { createPadGate } from './pad-gate';

const createInputMain = (ctx: MainContext): InputMain => {
  let options: InputOptions = {};
  let current: InputRuntime | null = null;
  let started = false;
  let starting: Promise<void> | null = null;
  let lifecycle = 0;
  const pad = createPadGate(ctx);

  const runtime = (): InputRuntime => {
    current ??= createInputRuntime(ctx, options);
    return current;
  };

  const start = (): Promise<void> => {
    if (starting) return starting;
    if (started) return Promise.resolve();
    const headless = ctx.flags.isHeadlessLaunch();
    if (headless && !ctx.flags.hasFlag(INPUT_LIVE_FLAG)) {
      ctx.log(`input: automation launch, SDL3 stays off so no controller is taken from the running session (${INPUT_LIVE_FLAG} turns it on)`);
      return Promise.resolve();
    }
    const generation = lifecycle;
    const pending = (async () => {
      const { mappings, source, status } = runtime();
      if (!status().available) {
        if (lifecycle === generation) started = true;
        return;
      }
      if (!pad.claim(headless)) return;
      await mappings.load();
      if (lifecycle !== generation) {
        pad.release();
        return;
      }
      source.start();
      started = true;
      ctx.log(`input: SDL3 ${status().sdlVersion ?? 'unknown'} started`);
    })().finally(() => { if (lifecycle === generation) starting = null; });
    starting = pending;
    return pending;
  };

  const stop = (): void => {
    lifecycle += 1;
    starting = null;
    pad.release();
    if (!current) return;
    current.haptics.cancelAll();
    current.source.stop();
    started = false;
  };

  return {
    configure: (next) => { options = { ...options, ...next }; },
    runtime,
    calibration: createCalibrationStore(ctx.files),
    start,
    stop,
  };
};

const getInput = memoByContext<MainContext, InputMain>(createInputMain);

export { getInput };
