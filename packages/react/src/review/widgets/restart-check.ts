/* @layer renderer-shell @kind logic */
import type { PoppedWidget, WidgetLayout } from '@drizztdourden08/tessera/composites';
import { profileViews } from '../../widgets/profile-views';
import { poppedWindows } from '../../widgets/popped-windows';
import { useWidgetLayoutStore } from '../../widgets/useWidgetLayoutStore';
import { until } from '../dom/until';
import type { StepTour } from '../review.type';
import { poppedEntry } from './popped-entry';
import { probe } from './probe';
import { sameRect } from './same-rect';
import { soon } from './soon';
import { storedLayout } from './stored-layout';
import { windowOpen } from './window-open';

const noExtra = () => ({});

const savedLayout = async (id: string): Promise<WidgetLayout | null> => {
  const own = (await probe({ kind: 'window', id })).bounds;
  await soon(() => sameRect(poppedEntry(id)?.bounds, own));
  const before = poppedEntry(id);
  profileViews.flush();
  const saved = await until(async () => sameRect((await storedLayout())?.popped.find((p) => p.id === id)?.bounds, before?.bounds));
  return saved ? storedLayout() : null;
};

const linkText = (entry: PoppedWidget): string => (entry.link ? `link ${entry.link.to}/${entry.link.edge}` : 'no link');

const reopenFrom = async (id: string, layout: WidgetLayout, wanted: PoppedWidget): Promise<boolean> => {
  poppedWindows.sync([], noExtra);
  if (!await windowOpen(id, false)) return false;
  useWidgetLayoutStore.getState().replace(layout);
  if (!await windowOpen(id, true)) return false;
  const now = await probe({ kind: 'window', id });
  return sameRect(now.bounds, wanted.bounds) && now.link?.to === wanted.link?.to && now.link?.edge === wanted.link?.edge;
};

const checkRestartRestore = async (tour: StepTour, id: string): Promise<void> => {
  const layout = await savedLayout(id);
  const wanted = layout?.popped.find((p) => p.id === id);
  if (!layout || !wanted) {
    tour.check('pop-out-restart-restores', false, '', `the saved layout holds no "${id}" window to restore`);
    return;
  }
  const kept = await reopenFrom(id, layout, wanted);
  const what = linkText(wanted);
  tour.check('pop-out-restart-restores', kept, `reopening from the saved layout restored the "${id}" window's bounds and ${what}`, `reopening from the saved layout lost the "${id}" window's bounds or ${what}`);
};

export { checkRestartRestore };
