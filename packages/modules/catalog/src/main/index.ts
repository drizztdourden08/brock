/* @layer electron-main @kind barrel */
import '../augment';
import type { MainModule } from '@drizztdourden08/brock-electron/main';
import { getCatalog } from './catalog-main';
import { registerCatalogHandlers } from './handlers';

const catalogMain: MainModule = {
  id: 'catalog',
  dataDirs: ['catalog'],
  register: (ctx) => {
    registerCatalogHandlers(ctx, getCatalog(ctx));
  },
};

export default catalogMain;
export { catalogMain, getCatalog };
export { configureCatalog } from './configure-catalog';
export type { CatalogMain } from './catalog-main.type';
export { createCatalogClient } from './catalog-client';
export { CatalogApiError } from './catalog-api-error';
export { isSignedOut } from './is-signed-out';
export { parseGrant } from './parse-grant';
export { DEFAULT_ROUTES } from './catalog-main.constants';
export { createCatalogLinks } from '../links/catalog-links';
export { isCatalogItemId } from '../links/is-catalog-item-id';
export type {
  CatalogConfig, CatalogEndpoint, CatalogSchema, CatalogRoute, CatalogRoutes, CatalogMethod, CatalogParse, CatalogInstaller, InstallInput, InstallOutcome,
  CatalogHooks,
} from './catalog-config.type';
export type { CatalogGrant, CatalogItem, CatalogLink, CatalogPage, InstalledRecord } from '../catalog.type';
