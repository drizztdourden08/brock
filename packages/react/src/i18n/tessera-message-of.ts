/* @layer renderer-shell @kind logic */
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import { TESSERA_NAMESPACE } from './brock-layers.constants';

const tesseraMessageOf = (i18n: I18n, group: string, name: string, values?: Record<string, string>): string | undefined => {
  const key = `${TESSERA_NAMESPACE}:${group}.${name}`;
  const text = values === undefined ? i18n.t(key) : i18n.t(key, values);
  return text === key || text === `[[${key}]]` ? undefined : text;
};

export { tesseraMessageOf };
