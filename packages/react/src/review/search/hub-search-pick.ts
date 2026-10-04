/* @layer renderer-shell @kind logic */
import { nav } from '../../navigation/nav';
import { ROUTE_SEPARATOR } from '../../navigation/navigation.constants';
import { click } from '../dom/click';
import { find } from '../dom/find';
import { settle } from '../dom/settle';
import { typeText } from '../dom/type-text';
import { waitFor } from '../dom/wait-for';
import { SEARCH_MISS, SELECTORS } from '../review.constants';
import type { SearchSample, StepTour } from '../review.type';
import { checkMascot } from './mascot-check';
import { paletteScopeCheck } from './palette-scope-check';
import { reachedTarget } from './reached-target';

const liveRow = (anchor: string): HTMLElement | null =>
  find(`${SELECTORS.hubSearchResults} [data-setting-key="${CSS.escape(anchor)}"]`);

const groupHeading = (pageId: string): HTMLElement | null =>
  find(`${SELECTORS.hubSearchResults} [data-group="${CSS.escape(pageId)}"] .search-result-group__open`);

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
  tour.check('search-hub-opens-page', reached, `the result group's Open button opened ${route}`, `the result group's Open button did not open ${route}`);
  return undefined;
};

const checkIdleAndEmpty = async (tour: StepTour, input: HTMLInputElement, bucket: string): Promise<void> => {
  input.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
  checkMascot(tour, 'search-hub-mascot-idle', `the empty "${bucket}" hub search`, await waitFor(() => find(SELECTORS.hubSearchIdle)));
  await tour.capture('search-hub-idle');
  typeText(input, SEARCH_MISS);
  checkMascot(tour, 'search-hub-mascot-empty', `the "${bucket}" hub search with no match`, await waitFor(() => find(SELECTORS.hubSearchEmpty)));
  await tour.capture('search-hub-empty');
};

const hubSearchPick = async (tour: StepTour, sample: SearchSample): Promise<void> => {
  const bucket = sample.target?.route.split(ROUTE_SEPARATOR)[0] ?? '';
  nav.open(bucket);
  const opened = await waitFor(() => nav.active() === bucket && find(SELECTORS.layer));
  if (opened === null) return tour.check('search-hub-opens', false, '', `the "${bucket}" hub did not open`);
  await settle();
  await paletteScopeCheck(tour, bucket, tour.env.screenTree?.hubs.find((hub) => hub.id === bucket)?.title ?? bucket);
  const mark = find(SELECTORS.hubSearchMark);
  if (mark) click(mark);
  const input = await waitFor(focusedSearch);
  tour.check('search-hub-focus', input !== null, `the "${bucket}" hub search takes the focus`, `the "${bucket}" hub search did not take the focus`);
  if (input === null) return undefined;
  await checkIdleAndEmpty(tour, input, bucket);
  typeText(input, sample.label);
  return checkLiveResult(tour, sample, bucket);
};

export { hubSearchPick };
