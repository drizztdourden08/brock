/* @layer renderer-shell @kind logic */
import { nav } from '../../navigation/nav';
import type { ScreenDef } from '../../screens/screen.type';
import { frameChecks } from '../checks/frame-checks';
import { pageHeaderChecks } from '../checks/page-header-checks';
import { settingRowChecks } from '../checks/setting-row-checks';
import { find } from '../dom/find';
import { settingRows } from '../dom/setting-rows';
import { isClosed } from '../dom/is-closed';
import { pageHeader } from '../dom/page-header';
import { waitFor } from '../dom/wait-for';
import { SELECTORS } from '../review.constants';
import type { StepTour } from '../review.type';
import { escapeCloses } from './escape-closes';
import { openScreen } from './open-screen';
import { readFrame } from './read-frame';

const reviewScreen = async (tour: StepTour, screen: ScreenDef): Promise<void> => {
  const { id, title } = screen;
  const via = await openScreen(tour.env, id);
  const shown = await waitFor(() => nav.active() === id && (screen.layer === 'own' || find(SELECTORS.layer) !== null));
  tour.check(`${id}-route`, shown !== null, `"${id}" opened through ${via}`, `"${id}" did not open through ${via}`);
  if (shown === null) return;
  if (screen.layer !== 'own' || find(SELECTORS.layer) !== null) tour.report(frameChecks(id, title, readFrame()));
  const header = pageHeader(find(SELECTORS.layer) ?? document);
  if (screen.header === 'none') tour.check(`${id}-no-page-header`, !header.shown, `"${id}" shows no page header, only its window title`, `"${id}" shows a page header it should not have`);
  else if (screen.header !== 'own') tour.report(pageHeaderChecks(id, screen.layer === 'own' ? null : title, header));
  tour.report(settingRowChecks(id, settingRows()));
  await tour.capture(`screen-${id}`);
  await escapeCloses(tour, id, isClosed);
};

export { reviewScreen };
