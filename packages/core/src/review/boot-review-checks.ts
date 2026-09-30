/* @layer core @kind logic */
import type { BootTimeline } from '../boot/boot-task.type';
import { GLOBAL_STEP } from './review.constants';
import type { ReviewCheck } from './review.type';

const splashCheck = ({ splashClosedAt, splashOpenAtCapture }: BootTimeline): ReviewCheck => {
  const pass = splashOpenAtCapture === false || (splashOpenAtCapture === null && splashClosedAt !== null);
  if (pass) return { id: 'splash-closed', step: GLOBAL_STEP, pass, reason: 'the splash window closed before the first capture' };
  const reason = splashOpenAtCapture ? 'the splash window was still open at the first capture' : 'the splash window never closed';
  return { id: 'splash-closed', step: GLOBAL_STEP, pass, reason };
};

const hiddenCheck = ({ bootDoneAt, appShownAt }: BootTimeline): ReviewCheck => {
  if (bootDoneAt === null) return { id: 'hidden-until-boot', step: GLOBAL_STEP, pass: false, reason: 'the boot tasks never all finished' };
  if (appShownAt === null) return { id: 'hidden-until-boot', step: GLOBAL_STEP, pass: false, reason: 'the app window was never shown' };
  const pass = appShownAt >= bootDoneAt;
  const reason = pass
    ? `the app window stayed hidden until the last boot task, shown ${appShownAt - bootDoneAt} ms after it`
    : `the app window was shown ${bootDoneAt - appShownAt} ms before the last boot task finished`;
  return { id: 'hidden-until-boot', step: GLOBAL_STEP, pass, reason };
};

const bootReviewChecks = (timeline: BootTimeline): ReviewCheck[] => [splashCheck(timeline), hiddenCheck(timeline)];

export { bootReviewChecks };
