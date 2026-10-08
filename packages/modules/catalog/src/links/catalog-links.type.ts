/* @layer core @kind types */
import type { CatalogLink } from '../catalog.type';

interface CatalogLinks {
  scheme: string;
  parse: (raw: string) => CatalogLink | null;
  format: (link: CatalogLink) => string;
  fromArgv: (argv: readonly string[]) => CatalogLink | null;
}

export type { CatalogLinks };
