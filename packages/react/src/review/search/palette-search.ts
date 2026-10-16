/* @layer renderer-shell @kind logic */
import { nav } from '../../navigation/nav';
import { find } from '../dom/find';
import { press } from '../dom/press-key';
import { settle } from '../dom/settle';
import { typeText } from '../dom/type-text';
import { waitFor } from '../dom/wait-for';
import { SEARCH_TOP, SELECTORS } from '../review.constants';
import type { PaletteSearch } from '../review.type';

const rowLabel = (row: HTMLElement): string => row.querySelector(SELECTORS.paletteRowLabel)?.textContent.trim() ?? '';

const topRows = (): HTMLElement[] => [...document.querySelectorAll<HTMLElement>(SELECTORS.paletteRow)].slice(0, SEARCH_TOP);

const paletteSearch = async (label: string): Promise<PaletteSearch> => {
  nav.close();
  await settle();
  press({ key: 'k', ctrlKey: true });
  const input = await waitFor(() => find(SELECTORS.paletteInput));
  if (!(input instanceof HTMLInputElement)) return { shown: [], row: null };
  typeText(input, label);
  await settle();
  const row = await waitFor(() => topRows().find((candidate) => rowLabel(candidate) === label));
  return { shown: topRows().map(rowLabel), row: row ?? null };
};

export { paletteSearch };
