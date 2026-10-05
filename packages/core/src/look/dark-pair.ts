/* @layer core @kind logic */
import { contrastRatio } from './contrast-ratio';
import { DARK_FROM_STEPS, DARK_STEP, DARK_TO_STEPS, DEFAULT_DIM_INK, DIM_TEXT_RATIO, PURE_BLACK } from './look.constants';
import type { DarkPair, LookSources, ResolvedLook } from './look.type';
import { mixHex } from './mix-hex';

const darkStop = (hex: string, steps: number, dim: string): string => {
  for (let step = steps; step > 0; step -= 1) {
    const stop = mixHex(hex, PURE_BLACK, step * DARK_STEP);
    if (contrastRatio(dim, stop) >= DIM_TEXT_RATIO) return stop;
  }
  return PURE_BLACK;
};

const ownColours = (look: Pick<ResolvedLook, 'source'>, sources: LookSources): boolean => {
  if (sources.themeDark === true || look.source === 'brand') return false;
  return look.source === 'product' || sources.themeSeeds === true;
};

const darkPair = (look: Pick<ResolvedLook, 'from' | 'to' | 'source'>, sources: LookSources): DarkPair | null => {
  if (!ownColours(look, sources)) return null;
  const dim = sources.inks?.dim ?? DEFAULT_DIM_INK;
  return { from: darkStop(look.from, DARK_FROM_STEPS, dim), to: darkStop(look.to, DARK_TO_STEPS, dim) };
};

export { darkPair };
