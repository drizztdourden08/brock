/* @layer renderer-shell @kind logic */
import type { DataDomainDef } from '@drizztdourden08/brock-core';
import type { SearchEntrySeed } from '../../../search/search.type';

const storageSearchEntries = (domains: readonly DataDomainDef[]): SearchEntrySeed[] => domains.map((def) => ({
  label: def.label,
  keywords: ['storage', 'folder', 'size', 'clear', def.domain],
  anchor: `storage-${def.domain}`,
  description: def.description ?? `Data/${def.dir}`,
}));

export { storageSearchEntries };
