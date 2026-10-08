/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { CatalogResult } from '../catalog.type';
import type { CatalogMain } from './catalog-main.type';
import { failureOf } from './failure-of';

const toResult = async <T>(run: () => Promise<T>): Promise<CatalogResult<T>> => {
  try {
    return { ok: true, data: await run() };
  } catch (error) {
    return failureOf(error);
  }
};

const registerCatalogHandlers = ({ handle }: Pick<MainContext, 'handle'>, catalog: CatalogMain): void => {
  handle('catalog:home', () => toResult(() => catalog.reads().home()));
  handle('catalog:list', (_event, query) => toResult(() => catalog.reads().list(query)));
  handle('catalog:item', (_event, itemId) => toResult(() => catalog.reads().item(itemId)));
  handle('catalog:installed', () => catalog.installed());
  handle('catalog:install', (_event, link) => catalog.install(link));
  handle('catalog:uninstall', (_event, itemId) => catalog.uninstall(itemId));
  handle('catalog:takeLinks', () => Promise.resolve(catalog.links.take()));
};

export { registerCatalogHandlers };
