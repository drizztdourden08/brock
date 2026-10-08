/* @layer electron-main @kind types */
import type { CatalogGrant, CatalogItem, CatalogListQuery } from '../catalog.type';

interface CatalogReads {
  home: () => Promise<unknown>;
  list: (query?: CatalogListQuery) => Promise<CatalogItem[]>;
  item: (itemId: string) => Promise<CatalogItem>;
  grant: (itemId: string, version: number | null) => Promise<CatalogGrant>;
}

export type { CatalogReads };
