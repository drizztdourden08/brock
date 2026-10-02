/* @layer renderer-shell @kind logic */
import { nav } from '../../navigation/nav';
import { ROUTE_SEPARATOR } from '../../navigation/navigation.constants';
import { palette } from '../../palette/palette';
import { click } from '../dom/click';
import { find } from '../dom/find';
import { press } from '../dom/press-key';
import { settle } from '../dom/settle';
import { typeText } from '../dom/type-text';
import { waitFor } from '../dom/wait-for';
import { SELECTORS } from '../review.constants';
import type { SearchSample, StepTour } from '../review.type';
import { reachedTarget } from './reached-target';

const liveRow = (anchor: string): HTMLElement | null =>
  find(`${SELECTORS.hubSearchResults} [data-setting-key="${CSS.escape(anchor)}"]`);

const groupHeading = (pageId: string): HTMLElement | null =>
  find(`${SELECTORS.hubSearchResults} [data-group="${CSS.escape(pageId)}"] .search-results__heading`);

const focusedSearch = (): HTMLInputElement | null => {
  const input = find(SELECTORS.hubSearchInput);
  return input instanceof HTMLInputElement && document.activeElement === input ? input : null;
};

const checkLiveResult = async (tour: StepTour, sample: SearchSample, bucket: string): Promise<void> => {
  const anchor = sample.target?.anchor ?? '';
  const row = await waitFor(() => liveRow(anchor));
  tour.check('search-hub-finds', row !== null, `the "${bucket}" hub search shows the live "${sample.label}" row`, `the "${bucket}" hub search does not show the live "${sample.label}" row`);
  if (row === null) return undefined;
  tour.check('search-hub-editable', row.querySelector(SELECTORS.liveControl) !== null, `the "${sample.label}" result holds its control, editable in place`, `the "${sample.label}" result has no control to edit`);
  await tour.capture('search-hub');
  const route = sample.target?.route ?? '';
  const heading = groupHeading(route.split(ROUTE_SEPARATOR)[1] ?? '');
  if (heading) click(heading);
  const reached = heading !== null && await reachedTarget({ ...sample, target: { route } });
  tour.check('search-hub-opens-page', reached, `the result group heading opened ${route}`, `the result group heading did not open ${route}`);
  return undefined;
};

const hubSearchPick = async (tour: StepTour, sample: SearchSample): Promise<void> => {
  const bucket = sample.target?.route.split(ROUTE_SEPARATOR)[0] ?? '';
  nav.open(bucket);
  const opened = await waitFor(() => nav.active() === bucket && find(SELECTORS.layer));
  if (opened === null) return tour.check('search-hub-opens', false, '', `the "${bucket}" hub did not open`);
  await settle();
  press({ key: 'k', ctrlKey: true });
  const input = await waitFor(focusedSearch);
  tour.check('search-hub-shortcut', input !== null && !palette.isOpen(), `Ctrl+K inside the "${bucket}" hub focused its search`, `Ctrl+K inside the "${bucket}" hub did not focus its search`);
  if (input === null) return undefined;
  typeText(input, sample.label);
  return checkLiveResult(tour, sample, bucket);
};

export { hubSearchPick };
