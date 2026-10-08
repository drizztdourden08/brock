/* @layer electron-main @kind logic */
import type { CatalogItem, CatalogListQuery } from '../catalog.type';
import { assertItemId } from './assert-item-id';
import type { CatalogClient } from './catalog-client.type';
import type { CatalogConfig, CatalogRoutes } from './catalog-config.type';
import { DEFAULT_MAX_PAGES, DEFAULT_ROUTES } from './catalog-main.constants';
import type { CatalogReads } from './catalog-reads.type';
import { parseGrant } from './parse-grant';

const queryOf = (query: CatalogListQuery = {}, cursor: string | null) => {
  const entries = Object.entries(query).filter(([, value]) => value === null || ['string', 'number', 'boolean'].includes(typeof value));
  return { ...Object.fromEntries(entries), cursor };
};

const createCatalogReads = (config: CatalogConfig, call: CatalogClient): CatalogReads => {
  const routes: CatalogRoutes = { ...DEFAULT_ROUTES, ...config.routes };
  const { schema } = config;
  const maxPages = config.maxPages ?? DEFAULT_MAX_PAGES;

  const home = async (): Promise<unknown> => {
    const answer = await call({ route: routes.home });
    return schema.home ? schema.home(answer) : answer;
  };

  const list = async (query?: CatalogListQuery): Promise<CatalogItem[]> => {
    const items: CatalogItem[] = [];
    let cursor: string | null = null;
    for (let page = 0; page < maxPages; page += 1) {
      const answer = schema.page(await call({ route: routes.list, query: queryOf(query, cursor) }));
      items.push(...answer.items);
      cursor = answer.nextCursor;
      if (!cursor) break;
    }
    return items;
  };

  const item = async (itemId: string): Promise<CatalogItem> => schema.item(await call({ route: routes.item, params: { id: assertItemId(itemId) } }));

  const grant = async (itemId: string, version: number | null) => {
    const answer = await call({ route: routes.grant, params: { id: assertItemId(itemId) }, body: version === null ? {} : { version } });
    return (schema.grant ?? parseGrant)(answer);
  };

  return { home, list, item, grant };
};

export { createCatalogReads };
