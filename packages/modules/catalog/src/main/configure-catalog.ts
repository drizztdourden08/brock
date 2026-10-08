/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { CatalogConfig } from './catalog-config.type';
import { getCatalog } from './catalog-main';
import type { CatalogMain } from './catalog-main.type';

const configureCatalog = (ctx: MainContext, config: CatalogConfig): CatalogMain => {
  const catalog = getCatalog(ctx);
  catalog.configure(config);
  return catalog;
};

export { configureCatalog };
