/* @layer renderer-shell @kind logic */
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import { tesseraMessageOf } from './tessera-message-of';

const tesseraObjectOf = (i18n: I18n, group: string, name: string, base: Record<string, unknown>): Record<string, string> | undefined => {
  const out: Record<string, string> = {};
  let found = false;
  for (const [sub, value] of Object.entries(base)) {
    const text = typeof value === 'string' ? tesseraMessageOf(i18n, group, `${name}.${sub}`) : undefined;
    if (text !== undefined) found = true;
    out[sub] = text ?? (typeof value === 'string' ? value : '');
  }
  return found ? out : undefined;
};

export { tesseraObjectOf };
