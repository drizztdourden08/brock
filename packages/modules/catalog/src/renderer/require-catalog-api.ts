/* @layer renderer-shell @kind logic */
import type { CatalogApi } from '../catalog.type';
import { catalogApi } from './catalog-api';

const requireCatalogApi = (): CatalogApi => {
  const api = catalogApi();
  if (!api) throw new Error('window.api.catalog is not installed: add the catalog module to the preload.');
  return api;
};

export { requireCatalogApi };
