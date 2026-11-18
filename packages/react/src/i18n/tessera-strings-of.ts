/* @layer renderer-shell @kind logic */
import { TESSERA_STRINGS } from '@drizztdourden08/tessera/primitives';
import type { TesseraStringsOverride } from '@drizztdourden08/tessera/primitives';
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import type { Groups } from './tessera-strings-of.type';
import { tesseraGroupOf } from './tessera-group-of';

const tesseraStringsOf = (i18n: I18n): TesseraStringsOverride => {
  if (i18n.chain.length <= 1) return {};
  const out: Groups = {};
  for (const [group, entries] of Object.entries(TESSERA_STRINGS)) out[group] = tesseraGroupOf(i18n, group, entries as Record<string, unknown>);
  out.dates = { ...out.dates, locale: i18n.locale };
  return out;
};

export { tesseraStringsOf };
