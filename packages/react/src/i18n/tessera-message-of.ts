/* @layer renderer-shell @kind logic */
import type { I18n, MessageKey } from '@drizztdourden08/brock-core/i18n';
import { TESSERA_NAMESPACE } from './brock-layers.constants';

// The key is built from a Tessera string group at run time, so it cannot be one of the app's typed keys.
const tesseraMessageOf = (i18n: I18n, group: string, name: string, values?: Record<string, string>): string | undefined => {
  const key = `${TESSERA_NAMESPACE}:${group}.${name}`;
  const text = i18n.text(values === undefined ? { key: key as MessageKey } : { key: key as MessageKey, values });
  return text === key || text === `[[${key}]]` ? undefined : text;
};

export { tesseraMessageOf };
