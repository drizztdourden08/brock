/* @layer renderer-shell @kind logic */
import type { ScreenSearchRow } from '../../screens/conventions/screens-config.type';
import { seedKeywords } from '../seed-keywords';
import type { SearchEntrySeed } from '../search.type';

const rowSeeds = (rows: readonly ScreenSearchRow[]): SearchEntrySeed[] => rows.map((row) => ({
  label: row.label,
  keywords: seedKeywords(row.keywords),
  ...(row.anchor === undefined ? {} : { anchor: row.anchor }),
}));

export { rowSeeds };
