/* @layer renderer-shell @kind barrel */
import '../augment';
import type { RendererModule } from '@drizztdourden08/brock-react';

const catalogRenderer: RendererModule = {
  id: 'catalog',
};

export default catalogRenderer;
export { catalogRenderer };
export { catalogApi } from './catalog-api';
export { requireCatalogApi } from './require-catalog-api';
export { useCatalogInstalled } from './useCatalogInstalled';
export { installedRecordOf } from './installed-record-of';
export { installedByName } from './installed-by-name';
export type { CatalogInstalledState } from './catalog-installed.type';
export { useCatalogItem } from './useCatalogItem';
export type { CatalogItemState } from './catalog-item.type';
export { useCatalogLinks } from './useCatalogLinks';
export { CatalogInstallBar, installBarProps } from '../compounds/CatalogInstallBar';
export type { CatalogInstallBarProps, CatalogInstallBarText, CatalogInstallProgress } from '../compounds/CatalogInstallBar';
export { createCatalogLinks } from '../links/catalog-links';
export { isCatalogItemId } from '../links/is-catalog-item-id';
export { CATALOG_JOB_PREFIX } from '../catalog.constants';
export type {
  CatalogApi, CatalogInstallResult, CatalogItem, CatalogLink, CatalogListQuery, CatalogResult, CatalogUninstallResult, InstalledRecord,
} from '../catalog.type';
