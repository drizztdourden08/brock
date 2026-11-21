/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { normaliseKeywords } from '../normalise-keywords';
import type { IndexEntry, SearchEntry } from '../search.type';

const resolveEntry = (entry: IndexEntry, text: (value: Text) => string): SearchEntry => ({
  ...entry,
  label: text(entry.label),
  keywords: normaliseKeywords(entry.keywords.map(text)),
  breadcrumb: entry.breadcrumb.map(text),
  description: entry.description === undefined ? undefined : text(entry.description),
  hint: entry.hint === undefined ? undefined : text(entry.hint),
});

export { resolveEntry };
