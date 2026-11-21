/* @layer renderer-shell @kind logic */
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import type { Group } from './tessera-strings-of.type';
import { tesseraFunctionString } from './tessera-function-string';
import { tesseraMessageOf } from './tessera-message-of';
import { tesseraObjectOf } from './tessera-object-of';

const entryOf = (i18n: I18n, group: string, name: string, base: unknown): Group[string] | undefined => {
  if (typeof base === 'string') return tesseraMessageOf(i18n, group, name);
  if (typeof base === 'function') return tesseraFunctionString(i18n, group, name);
  if (typeof base === 'object' && base !== null && !Array.isArray(base)) return tesseraObjectOf(i18n, group, name, Object.fromEntries(Object.entries(base)));
  return undefined;
};

const tesseraGroupOf = (i18n: I18n, group: string, entries: Record<string, unknown>): Group => {
  const out: Group = {};
  for (const [name, base] of Object.entries(entries)) {
    const entry = entryOf(i18n, group, name, base);
    if (entry !== undefined) out[name] = entry;
  }
  return out;
};

export { tesseraGroupOf };
