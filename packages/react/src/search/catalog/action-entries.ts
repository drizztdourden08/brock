/* @layer renderer-shell @kind logic */
import { normaliseKeywords } from '../normalise-keywords';
import type { SearchAction, SearchEntry } from '../search.type';

const actionEntries = (actions: readonly SearchAction[]): SearchEntry[] =>
  actions.map((action) => ({
    id: `action:${action.id}`,
    kind: 'action',
    label: action.label,
    icon: action.icon,
    breadcrumb: action.group ? [action.group] : [],
    description: action.description,
    keywords: normaliseKeywords(action.keywords),
    disabled: action.disabled,
    checked: action.checked,
    run: action.run,
  }));

export { actionEntries };
