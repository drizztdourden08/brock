/* @layer core @kind types */
import type { Catalog, Layer } from './catalog/catalog.type';

type Loader = (tag: string) => Promise<readonly Layer[]>;

type LoadCtx = {
  readonly catalog: Catalog;
  readonly pending: Map<string, Promise<void>>;
  readonly load: Loader | undefined;
};

export type { Loader, LoadCtx };
