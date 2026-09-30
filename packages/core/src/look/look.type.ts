/* @layer core @kind types */
import type { ProductInput } from '../product/product.type';

type LookGradient = [string, string, string?];

interface ProductLook {
  gradient: LookGradient;
  angle?: number;
}

interface PaletteSeeds {
  primary: string;
  black: string;
}

interface LookSources {
  brand?: ProductLook | null;
  seeds: PaletteSeeds;
}

type LookSource = 'product' | 'brand' | 'palette';

type LookProduct = Pick<ProductInput, 'accent' | 'look' | 'window'>;

interface ResolvedLook {
  from: string;
  via: string | null;
  to: string;
  angle: number;
  accent: string;
  source: LookSource;
}

export type { LookGradient, LookProduct, LookSource, LookSources, PaletteSeeds, ProductLook, ResolvedLook };
