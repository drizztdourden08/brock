/* @layer renderer-shell @kind logic */
import { nav } from '../../navigation/nav';
import { click } from '../dom/click';
import { find } from '../dom/find';
import { press } from '../dom/press-key';
import { settle } from '../dom/settle';
import { typeText } from '../dom/type-text';
import { waitFor } from '../dom/wait-for';
import { SEARCH_TOP, SELECTORS } from '../review.constants';
import type { SearchPick } from '../review.type';

const rowLabel = (row: HTMLElement): string => row.querySelector(SELECTORS.paletteRowLabel)?.textContent.trim() ?? '';

const topRows = (): HTMLElement[] => [...document.querySelectorAll<HTMLElement>(SELECTORS.paletteRow)].slice(0, SEARCH_TOP);

const palettePick = async (label: string, capture?: () => Promise<void>): Promise<SearchPick> => {
  nav.close();
  await settle();
  press({ key: 'k', ctrlKey: true });
  const input = await waitFor(() => find(SELECTORS.paletteInput));
  if (!(input instanceof HTMLInputElement)) return { shown: [], picked: false };
  typeText(input, label);
  await settle();
  const row = await waitFor(() => topRows().find((candidate) => rowLabel(candidate) === label));
  const shown = topRows().map(rowLabel);
  if (!row) return { shown, picked: false };
  await capture?.();
  click(row);
  return { shown, picked: true };
};

export { palettePick };
