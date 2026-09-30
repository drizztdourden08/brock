/* @layer core @kind logic */
import type { LookProduct, LookSources, LookStops, ProductLook, ResolvedLook } from './look.type';
import { DEFAULT_INKS, DEFAULT_LOOK_ANGLE, HEX_PAIR, PALETTE_VIA_SHARE } from './look.constants';
import { mixHex } from './mix-hex';
import { pickInk } from './pick-ink';

const fromLook = (look: ProductLook): LookStops => {
  const [from, to, via] = look.gradient;
  const bad = [from, to, via].find((stop) => stop !== undefined && !HEX_PAIR.test(stop));
  if (bad !== undefined) throw new Error(`look gradient stop "${bad}" must be a colour like "#3b6fe0"`);
  return { from, to, via: via ?? null, angle: Number.isFinite(look.angle) ? Number(look.angle) : DEFAULT_LOOK_ANGLE };
};

const fromSeeds = ({ primary, black }: LookSources['seeds']): LookStops => ({
  from: primary,
  via: mixHex(primary, black, PALETTE_VIA_SHARE),
  to: black,
  angle: DEFAULT_LOOK_ANGLE,
});

const withInk = (stops: LookStops, inks: NonNullable<LookSources['inks']>): Pick<ResolvedLook, 'ink' | 'shade'> => {
  const ink = pickInk([stops.from, stops.to, ...(stops.via ? [stops.via] : [])], inks);
  return { ink, shade: ink === inks.dark ? inks.light : inks.dark };
};

const stopsFor = (product: LookProduct, sources: LookSources): { stops: LookStops; source: ResolvedLook['source'] } => {
  if (product.look) return { stops: fromLook(product.look), source: 'product' };
  if (sources.brand) return { stops: fromLook(sources.brand), source: 'brand' };
  return { stops: fromSeeds(sources.seeds), source: 'palette' };
};

const resolveLook = (product: LookProduct, sources: LookSources): ResolvedLook => {
  const accent = product.window?.splash?.accent ?? product.accent ?? sources.seeds.primary;
  if (!HEX_PAIR.test(accent)) throw new Error(`the splash accent "${accent}" must be a colour like "#3b6fe0"`);
  const { stops, source } = stopsFor(product, sources);
  return { ...stops, ...withInk(stops, sources.inks ?? DEFAULT_INKS), accent, source };
};

export { resolveLook };
