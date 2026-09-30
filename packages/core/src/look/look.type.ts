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

interface LookInks {
  light: string;
  dark: string;
}

interface LookSources {
  brand?: ProductLook | null;
  seeds: PaletteSeeds;
  inks?: LookInks;
}

type LookSource = 'product' | 'brand' | 'palette';

type LookProduct = Pick<ProductInput, 'accent' | 'look' | 'window'>;

interface ResolvedLook {
  from: string;
  via: string | null;
  to: string;
  angle: number;
  accent: string;
  ink: string;
  shade: string;
  source: LookSource;
}

type LookStops = Pick<ResolvedLook, 'from' | 'via' | 'to' | 'angle'>;

export type { LookGradient, LookInks, LookProduct, LookSource, LookSources, LookStops, PaletteSeeds, ProductLook, ResolvedLook };
