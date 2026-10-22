/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { PadGate } from './pad-gate.type';
import { INPUT_LIVE_FLAG } from './pad-lock.constants';
import { createPadLock } from './pad-lock';

const createPadGate = (ctx: MainContext): PadGate => {
  const lock = createPadLock({ product: ctx.product.name });
  let refusalLogged = false;
  const claim = (headless: boolean): boolean => {
    const result = lock.claim(!headless);
    if (result.ok) {
      refusalLogged = false;
      return true;
    }
    if (!refusalLogged) {
      const { holder } = result;
      ctx.log(`input: ${INPUT_LIVE_FLAG} refused, ${holder.product} (pid ${holder.pid}) already holds the controllers since ${holder.since}. SDL3 stays off`, 'warn');
      refusalLogged = true;
    }
    return false;
  };
  return { claim, release: lock.release };
};

export { createPadGate };
