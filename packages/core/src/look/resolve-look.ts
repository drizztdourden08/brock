/* @layer core @kind logic */
import type { LookProduct, LookSources, ProductLook, ResolvedLook } from './look.type';
import { DEFAULT_LOOK_ANGLE, HEX_PAIR, PALETTE_VIA_SHARE } from './look.constants';
import { mixHex } from './mix-hex';

const fromLook = (look: ProductLook): Pick<ResolvedLook, 'from' | 'via' | 'to' | 'angle'> => {
  const [from, to, via] = look.gradient;
  const bad = [from, to, via].find((stop) => stop !== undefined && !HEX_PAIR.test(stop));
  if (bad !== undefined) throw new Error(`look gradient stop "${bad}" must be a colour like "#3b6fe0"`);
  return { from, to, via: via ?? null, angle: Number.isFinite(look.angle) ? Number(look.angle) : DEFAULT_LOOK_ANGLE };
};

const fromSeeds = ({ primary, black }: LookSources['seeds']): Pick<ResolvedLook, 'from' | 'via' | 'to' | 'angle'> => ({
  from: primary,
  via: mixHex(primary, black, PALETTE_VIA_SHARE),
  to: black,
  angle: DEFAULT_LOOK_ANGLE,
});

const resolveLook = (product: LookProduct, sources: LookSources): ResolvedLook => {
  const accent = product.window?.splash?.accent ?? product.accent ?? sources.seeds.primary;
  if (!HEX_PAIR.test(accent)) throw new Error(`the splash accent "${accent}" must be a colour like "#3b6fe0"`);
  if (product.look) return { ...fromLook(product.look), accent, source: 'product' };
  if (sources.brand) return { ...fromLook(sources.brand), accent, source: 'brand' };
  return { ...fromSeeds(sources.seeds), accent, source: 'palette' };
};

export { resolveLook };
