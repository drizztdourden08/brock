/* @layer renderer-shell @kind logic */
import { nav } from '../navigation/nav';
import { screenReset } from '../screens/screen-reset';
import { RESET_FRAME_FALLBACK_MS } from './tours.constants';
import type { TourStepDef } from './tour.type';

const nextFrame = (signal: AbortSignal): Promise<void> =>
  new Promise((resolve) => {
    if (signal.aborted) {
      resolve();
      return;
    }
    const timer = setTimeout(resolve, RESET_FRAME_FALLBACK_MS);
    requestAnimationFrame(() => {
      clearTimeout(timer);
      resolve();
    });
  });

const resetStepScreen = async (step: TourStepDef, signal: AbortSignal): Promise<void> => {
  if (!step.reset) return;
  if (step.open) await nextFrame(signal);
  if (signal.aborted) return;
  const screen = nav.active();
  if (screen === null) return;
  screenReset.reset(screen, step.reset);
  await nextFrame(signal);
};

export { resetStepScreen };
