/* @layer electron-main @kind constants */
import { QUIET_FRAMES } from './review-baselines.constants';

const QUIET_SCRIPT = `(async () => {
  if (document.visibilityState !== 'visible') return;
  let quiet = 0;
  const stirred = () => { quiet = 0; };
  const mutations = new MutationObserver(stirred);
  mutations.observe(document, { subtree: true, childList: true });
  const moving = () => document.getAnimations().some((motion) => motion.playState === 'running'
    && Number.isFinite(motion.effect ? motion.effect.getComputedTiming().endTime : Infinity));
  await new Promise((done) => {
    const frame = () => {
      quiet = moving() ? 0 : quiet + 1;
      if (quiet >= ${QUIET_FRAMES}) done();
      else requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });
  mutations.disconnect();
})()`;

export { QUIET_SCRIPT };
