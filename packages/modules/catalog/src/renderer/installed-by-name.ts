/* @layer renderer-shell @kind logic */
import type { InstalledRecord } from '../catalog.type';
import type { CatalogInstalledState } from './catalog-installed.type';

const installedByName = (kind: string | null, name: string | null) => (state: CatalogInstalledState): InstalledRecord | null =>
  (name === null ? null : state.records.find((record) => record.kind === kind && record.installedName === name) ?? null);

export { installedByName };
