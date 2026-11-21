/* @layer electron-main @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { CatalogRoutes } from './catalog-config.type';

const DEFAULT_ROUTES: CatalogRoutes = {
  home: { method: 'GET', path: '/home' },
  list: { method: 'GET', path: '/items' },
  item: { method: 'GET', path: '/items/:id' },
  grant: { method: 'POST', path: '/items/:id/download' },
};

const REGISTRY_PATH = 'catalog/installed.json';
const DEFAULT_MAX_PAGES = 50;
const UNAUTHORIZED = 401;

const INSTALL_STEPS = [
  { id: 'grant', label: msg('catalog:job.step.grant'), weight: 1 },
  { id: 'download', label: msg('catalog:job.step.download'), weight: 6 },
  { id: 'verify', label: msg('catalog:job.step.verify'), weight: 1 },
  { id: 'unpack', label: msg('catalog:job.step.unpack'), weight: 2 },
];

export { DEFAULT_ROUTES, REGISTRY_PATH, DEFAULT_MAX_PAGES, UNAUTHORIZED, INSTALL_STEPS };
