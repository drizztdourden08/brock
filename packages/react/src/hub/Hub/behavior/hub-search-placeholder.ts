/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { DEFAULT_SEARCH_PLACEHOLDER } from '../../hub.constants';
import type { HubDef, HubSearch } from '../../hub.type';

const hubSearchPlaceholder = (def: HubDef, search: HubSearch, text: (value: Text) => string): string => {
  if (search.placeholder !== undefined) return text(search.placeholder);
  return text(search.titled === true ? msg('brock-app:screens.search', { title: text(def.title) }) : DEFAULT_SEARCH_PLACEHOLDER);
};

export { hubSearchPlaceholder };
