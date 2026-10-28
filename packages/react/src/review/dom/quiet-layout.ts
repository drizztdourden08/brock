/* @layer renderer-shell @kind logic */
import { QUIET_FRAMES, WAIT_CEILING_MS } from '../review.constants';
import { reviewAlive } from './review-alive';

const finiteMotion = (): boolean => typeof document.getAnimations === 'function'
  && document.getAnimations().some((motion) => Number.isFinite(motion.effect?.getComputedTiming().endTime ?? Number.POSITIVE_INFINITY) && motion.playState === 'running');

const quietLayout = (ceilingMs = WAIT_CEILING_MS): Promise<void> => new Promise((resolve) => {
  if (typeof document === 'undefined') {
    resolve();
    return;
  }
  let quiet = 0;
  let finished = false;
  const stirred = (): void => { quiet = 0; };
  const mutations = typeof MutationObserver === 'undefined' ? null : new MutationObserver(stirred);
  mutations?.observe(document, { subtree: true, childList: true });
  const sizes = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(stirred);
  sizes?.observe(document.documentElement);
  const end = (): void => {
    if (finished) return;
    finished = true;
    clearTimeout(ceiling);
    mutations?.disconnect();
    sizes?.disconnect();
    resolve();
  };
  const ceiling = setTimeout(end, ceilingMs);
  const frame = (): void => {
    if (finished) return;
    reviewAlive();
    quiet = finiteMotion() ? 0 : quiet + 1;
    if (quiet >= QUIET_FRAMES) end();
    else requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
});

export { quietLayout };
