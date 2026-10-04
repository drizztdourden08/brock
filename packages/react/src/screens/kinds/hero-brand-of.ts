/* @layer renderer-shell @kind logic */
import { BRAND_APPS } from '@drizztdourden08/tessera/brand';
import type { BrandApp } from '@drizztdourden08/tessera/brand';

const heroBrandOf = (brand: string | undefined): BrandApp | undefined => BRAND_APPS.find((app) => app === brand);

export { heroBrandOf };
