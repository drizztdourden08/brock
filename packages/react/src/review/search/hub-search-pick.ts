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

const hitFor = (label: string): HTMLElement | undefined =>
  [...document.querySelectorAll<HTMLElement>(SELECTORS.hubSearchHit)].find((hit) => hit.textContent.trim().startsWith(label));

const focusedSearch = (): HTMLInputElement | null => {
  const input = find(SELECTORS.hubSearchInput);
  return input instanceof HTMLInputElement && document.activeElement === input ? input : null;
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
  const hit = await waitFor(() => hitFor(sample.label));
  tour.check('search-hub-finds', hit !== null, `the "${bucket}" hub search lists "${sample.label}"`, `the "${bucket}" hub search does not list "${sample.label}"`);
  if (hit === null) return undefined;
  await tour.capture('search-hub');
  click(hit);
  const reached = await reachedTarget(sample);
  tour.check('search-hub-jumps', reached, `the hub hit opened ${sample.target?.route ?? ''} and flashed "${sample.label}"`, `the hub hit did not open and flash "${sample.label}"`);
  return undefined;
};

export { hubSearchPick };
