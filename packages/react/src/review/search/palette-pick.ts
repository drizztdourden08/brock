/* @layer renderer-shell @kind logic */
import { click } from '../dom/click';
import type { SearchPick } from '../review.type';
import { paletteSearch } from './palette-search';

const palettePick = async (label: string, capture?: () => Promise<void>): Promise<SearchPick> => {
  const { shown, row } = await paletteSearch(label);
  if (!row) return { shown, picked: false };
  await capture?.();
  click(row);
  return { shown, picked: true };
};

export { palettePick };
