/* @layer renderer-shell @kind logic */
import { profileViews } from '../../widgets/profile-views';
import { until } from '../dom/until';
import type { StepTour } from '../review.type';
import { poppedEntry } from './popped-entry';
import { probe } from './probe';
import { soon } from './soon';
import { sameRect } from './same-rect';
import { storedLayout } from './stored-layout';
import { EDGE_DROP, FREE_GAP } from './widget-review.constants';

const checkBoundsRoundTrip = async (tour: StepTour, id: string): Promise<void> => {
  const main = (await probe({ kind: 'main' })).bounds;
  const own = (await probe({ kind: 'window', id })).bounds;
  if (!main || !own) {
    tour.check('pop-out-bounds-saved', false, '', `no bounds came back for the app or the "${id}" window`);
    return;
  }
  const moved = (await probe({ kind: 'drag', alone: true, id, bounds: { ...own, x: main.x + main.width + FREE_GAP, y: main.y + EDGE_DROP } })).bounds;
  const saved = await soon(() => sameRect(poppedEntry(id)?.bounds, moved));
  tour.check('pop-out-bounds-saved', saved, `moving the "${id}" window reached the layout`, `the layout kept stale bounds after the "${id}" window moved`);
  profileViews.flush();
  const stored = await until(async () => sameRect((await storedLayout())?.popped.find((p) => p.id === id)?.bounds, moved));
  tour.check('pop-out-bounds-stored', stored, 'the moved bounds were saved with the profile', 'the moved bounds never reached the saved profile layout');
};

export { checkBoundsRoundTrip };
