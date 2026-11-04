/* @layer core @kind types */
import type { BasedOn } from './based-on.type';

interface MsuPackMeta {
  name: string;
  author?: string;
  description?: string;
  cover?: string;
  game?: string;
  createdAt: number;
  modifiedAt: number;
  basedOn?: BasedOn;
}

export type { MsuPackMeta };
