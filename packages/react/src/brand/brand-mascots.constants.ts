/* @layer renderer-shell @kind constants */
import type { BrandApp, MascotName } from '@drizztdourden08/tessera/brand';

const BRAND_MASCOTS = {
  tessera: null,
  brock: 'flint',
  archipelia: 'pelago',
  rotp: 'sentri',
} as const satisfies Record<BrandApp, MascotName | null>;

export { BRAND_MASCOTS };
