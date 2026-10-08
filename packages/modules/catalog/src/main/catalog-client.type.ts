/* @layer electron-main @kind types */
import type { CatalogRoute } from './catalog-config.type';

type QueryValue = string | number | boolean | null | undefined;

interface CatalogCall {
  route: CatalogRoute;
  params?: Record<string, string>;
  query?: Record<string, QueryValue>;
  body?: unknown;
}

type CatalogClient = (call: CatalogCall) => Promise<unknown>;

export type { CatalogCall, CatalogClient };
