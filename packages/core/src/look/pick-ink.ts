/* @layer core @kind logic */
import type { LookInks } from './look.type';
import { contrastRatio } from './contrast-ratio';

const worstContrast = (ink: string, stops: readonly string[]): number =>
  Math.min(...stops.map((stop) => contrastRatio(ink, stop)));

const pickInk = (stops: readonly string[], inks: LookInks): string =>
  (worstContrast(inks.dark, stops) > worstContrast(inks.light, stops) ? inks.dark : inks.light);

export { pickInk };
