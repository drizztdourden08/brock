/* @layer renderer-shell @kind logic */
import { find } from '../dom/find';
import { soon } from './soon';
import type { StepTour } from '../review.type';
import { probe } from './probe';
import { GUIDE_SELECTOR } from './widget-review.constants';

const guideIs = (mode: string, snapping: string): Promise<boolean> =>
  soon(() => {
    const guide = find(GUIDE_SELECTOR);
    return guide?.getAttribute('data-window-guide') === mode && guide.getAttribute('data-snapping') === snapping;
  });

const checkGuide = async (tour: StepTour, id: string): Promise<void> => {
  await probe({ kind: 'guide', id, mode: 'moving' });
  const shown = await guideIs('moving', 'on');
  await tour.capture('window-guide');
  await probe({ kind: 'modifier', ctrl: true });
  const off = shown && await guideIs('moving', 'off');
  await probe({ kind: 'modifier', ctrl: false });
  tour.check('guide-shows', off, 'moving a window showed the guide over the app with the mode, and Ctrl turned snapping off in it', 'the guide did not show while a window moved, or did not follow Ctrl');
  await probe({ kind: 'guide', id, mode: null });
  const hidden = await soon(() => find(GUIDE_SELECTOR) === null);
  tour.check('guide-hides', hidden, 'the guide went away when the move ended', 'the guide stayed on screen after the move ended');
};

export { checkGuide };
