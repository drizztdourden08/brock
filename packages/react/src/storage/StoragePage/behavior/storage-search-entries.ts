/* @layer renderer-shell @kind logic */
import type { DataDomainDef } from '@drizztdourden08/brock-core';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { SearchEntrySeed } from '../../../search/search.type';

const storageSearchEntries = (domains: readonly DataDomainDef[], text: (value: Text) => string): SearchEntrySeed[] => domains.map((def) => ({
  label: text(def.label),
  keywords: ['storage', 'folder', 'size', 'clear', def.domain],
  anchor: `storage-${def.domain}`,
  description: def.description === undefined ? `Data/${def.dir}` : text(def.description),
}));

export { storageSearchEntries };
