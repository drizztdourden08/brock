/* @layer renderer-shell @kind barrel */
export { buildSearchIndex } from './build-search-index';
export { buildCatalog } from './catalog/build-catalog';
export { rankEntries } from './rank-entries';
export { entriesInBucket } from './entries-in-bucket';
export { normaliseKeywords } from './normalise-keywords';
export { openSearchTarget } from './open-search-target';
export { scrollToAnchor } from './scroll-to-anchor';
export * from './SearchAnchor';
export { registerSearchActions } from './register-search-actions';
export { useSearchActions } from './useSearchActions';
export { useSearchActionStore } from './useSearchActionStore';
export { useSearchEntries } from './useSearchEntries';
export { useSearchIndex } from './useSearchIndex';
export type {
  CatalogInput, SearchAction, SearchActionState, SearchEntry, SearchEntrySeed, SearchFileKind, SearchFileSeed, SearchKind, SearchRowSeed,
  SearchSectionSeed, SearchTarget, SearchToggle, SettingsPlace,
} from './search.type';
