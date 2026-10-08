/* @layer electron-preload @kind barrel */
import '../augment';
import type { BridgeTools, PreloadNamespace } from '@drizztdourden08/brock-electron/preload';
import type { CatalogApi } from '../catalog.type';

const buildCatalogApi = ({ invoke, subscribe }: BridgeTools): CatalogApi => ({
  home: () => invoke('catalog:home'),
  list: (query) => invoke('catalog:list', query),
  item: (itemId) => invoke('catalog:item', itemId),
  installed: () => invoke('catalog:installed'),
  install: (link) => invoke('catalog:install', link),
  uninstall: (itemId) => invoke('catalog:uninstall', itemId),
  takeLinks: () => invoke('catalog:takeLinks'),
  onLink: (listener) => subscribe('catalog:link', listener),
  onChanged: (listener) => subscribe('catalog:changed', listener),
});

const catalogPreload: PreloadNamespace = {
  id: 'catalog',
  build: buildCatalogApi,
};

export default catalogPreload;
export { catalogPreload, buildCatalogApi };
export type { CatalogApi } from '../catalog.type';
