/* @layer renderer-shell @kind logic */
import { TESSERA_STRINGS } from '@drizztdourden08/tessera/primitives';
import type { TesseraStringsOverride } from '@drizztdourden08/tessera/primitives';
import type { I18n, MessageKey } from '@drizztdourden08/brock-core/i18n';
import type { Groups } from './tessera-strings-of.type';
import { TESSERA_NAMESPACE } from './brock-layers.constants';

const translated = (i18n: I18n, group: string, name: string): string | undefined => {
  const key = `${TESSERA_NAMESPACE}:${group}.${name}`;
  const text = i18n.t(key as MessageKey);
  return text === key || text === `[[${key}]]` ? undefined : text;
};

const groupOf = (i18n: I18n, group: string, entries: Record<string, unknown>): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [name, base] of Object.entries(entries)) {
    const text = typeof base === 'string' ? translated(i18n, group, name) : undefined;
    if (text !== undefined) out[name] = text;
  }
  return out;
};

const tesseraStringsOf = (i18n: I18n): TesseraStringsOverride => {
  if (i18n.chain.length <= 1) return {};
  const out: Groups = {};
  for (const [group, entries] of Object.entries(TESSERA_STRINGS)) out[group] = groupOf(i18n, group, entries as Record<string, unknown>);
  out.dates = { ...out.dates, locale: i18n.locale };
  return out as TesseraStringsOverride;
};

export { tesseraStringsOf };
