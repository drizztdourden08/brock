/* @layer core @kind types */
import type { Catalog } from './catalog/catalog.type';
import type { MissingEvent } from './i18n.type';

type ResolveDeps = {
  readonly catalog: Catalog;
  readonly locale: string;
  readonly chain: readonly string[];
  readonly dev: boolean;
  readonly report: (event: MissingEvent) => void;
};

type Resolved = { readonly text: string; readonly locale: string; readonly literal: boolean };

export type { ResolveDeps, Resolved };
