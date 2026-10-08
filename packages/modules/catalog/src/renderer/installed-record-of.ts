/* @layer renderer-shell @kind logic */
import type { InstalledRecord } from '../catalog.type';
import type { CatalogInstalledState } from './catalog-installed.type';

const installedRecordOf = (itemId: string) => (state: CatalogInstalledState): InstalledRecord | null =>
  state.records.find((record) => record.itemId === itemId) ?? null;

export { installedRecordOf };
