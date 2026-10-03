/* @layer renderer-shell @kind logic */
import { frameOf, getWidgetDefinition, setFrame } from '@drizztdourden08/tessera/composites';
import type { WidgetVisibility } from '@drizztdourden08/tessera/composites';
import { nav } from '../../navigation/nav';
import { useWidgetLayoutStore } from '../../widgets/useWidgetLayoutStore';
import { ABOUT_SCREEN } from '../review.constants';
import type { StepTour } from '../review.type';
import { poppedEntry } from './popped-entry';
import { windowOpen } from './window-open';
import { probe } from './probe';
import { sameRect } from './same-rect';

const store = () => useWidgetLayoutStore.getState();

const showAs = (id: string, show: WidgetVisibility): void => {
  const definition = getWidgetDefinition(store().definitions, id);
  store().change((layout) => setFrame(layout, id, { show }, definition));
};

const checkContextGate = async (tour: StepTour, id: string): Promise<void> => {
  const page = nav.active();
  const show = frameOf(store().layout, id, getWidgetDefinition(store().definitions, id)).show;
  nav.close();
  showAs(id, 'context-only');
  const open = await windowOpen(id, true);
  const remembered = (await probe({ kind: 'window', id })).bounds;
  nav.open(ABOUT_SCREEN);
  const closed = open && await windowOpen(id, false) && poppedEntry(id) !== null;
  tour.check('gate-context-only-closes', closed, `a context-only "${id}" window closed while a page was open and kept its place in the layout`, `a context-only "${id}" window stayed open over a page`);
  nav.close();
  const back = closed && await windowOpen(id, true);
  const same = back && sameRect((await probe({ kind: 'window', id })).bounds, remembered);
  tour.check('gate-context-only-reopens', same, `the "${id}" window came back where it was once the page closed`, `the "${id}" window did not come back where it was`);
  showAs(id, show);
  if (page !== null) nav.open(page);
};

export { checkContextGate };
