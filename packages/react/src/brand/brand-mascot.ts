/* @layer renderer-shell @kind logic */
import { BRAND_APPS, BRAND_FAMILY } from '@drizztdourden08/tessera/brand';
import type { MascotName } from '@drizztdourden08/tessera/brand';
import { BRAND_MASCOTS } from './brand-mascots.constants';

const brandMascot = (brand: string | undefined): MascotName | undefined => {
  const app = BRAND_APPS.find((id) => id === brand);
  if (!app || !BRAND_FAMILY[app].mascot) return undefined;
  return BRAND_MASCOTS[app] ?? undefined;
};

export { brandMascot };
