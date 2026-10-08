/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { InputMain, InputOptions, InputRuntime } from './input-main.type';
import { createCalibrationStore } from '../calibration/calibration-store';
import { createInputRuntime } from './create-input-runtime';

const instances = new WeakMap<MainContext, InputMain>();

const createInputMain = (ctx: MainContext): InputMain => {
  let options: InputOptions = {};
  let current: InputRuntime | null = null;
  let started = false;

  const runtime = (): InputRuntime => {
    current ??= createInputRuntime(ctx, options);
    return current;
  };

  const start = async (): Promise<void> => {
    if (started) return;
    if (ctx.flags.isHeadlessLaunch()) {
      ctx.log('input: automation launch, SDL3 stays off so no controller is taken from the running session');
      return;
    }
    started = true;
    const { mappings, source, status } = runtime();
    if (!status().available) return;
    await mappings.load();
    source.start();
    ctx.log(`input: SDL3 ${status().sdlVersion ?? 'unknown'} started`);
  };

  const stop = (): void => {
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

const getInput = (ctx: MainContext): InputMain => {
  const existing = instances.get(ctx);
  if (existing) return existing;
  const created = createInputMain(ctx);
  instances.set(ctx, created);
  return created;
};

export { getInput };
