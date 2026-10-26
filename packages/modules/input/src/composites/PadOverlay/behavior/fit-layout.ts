/* @layer renderer-components @kind logic */
import { GROWN_COST, GROW_ROWS, MIN_SCALE_RATIO, SCALE_CANDIDATES, SCALE_STEP, SEARCH_STEPS, SHRINK_COST } from '../PadOverlay.constants';
import type { OverlayLayout } from '../PadOverlay.type';
import { attemptLayout } from './attempt-layout';
import { growLayout } from './grow-layout';
import { layoutCost } from './layout-cost';
import type { FitInput, Fitted } from './placement.type';
import { topScale } from './top-scale';

const shrinkLayout = (input: FitInput, top: number): OverlayLayout => {
  const roomiest = { top: GROW_ROWS, bottom: GROW_ROWS };
  let scale = top;
  for (let step = 1; step < SEARCH_STEPS; step += 1) {
    const next = top * (1 - step * SCALE_STEP);
    if (next < top * MIN_SCALE_RATIO) break;
    scale = next;
    if (attemptLayout(input, scale, roomiest).clear) return growLayout(input, scale)?.layout ?? attemptLayout(input, scale, roomiest);
  }
  return attemptLayout(input, scale, roomiest);
};

const scoreOf = (fitted: Fitted, top: number, height: number): number =>
  layoutCost(fitted.layout) + fitted.layout.frame.height + (1 - fitted.scale / top) * SHRINK_COST + Math.max(0, fitted.layout.frame.height - height) * GROWN_COST;

const scaledLayout = (input: FitInput, top: number): Fitted | null => {
  let best: { fitted: Fitted; score: number } | null = null;
  for (let step = 0; step < SCALE_CANDIDATES; step += 1) {
    const ratio = 1 - step * SCALE_STEP;
    const fitted = ratio < MIN_SCALE_RATIO ? null : growLayout(input, top * ratio);
    if (!fitted) continue;
    const score = scoreOf(fitted, top, input.metrics.height);
    if (!best || score < best.score) best = { fitted, score };
    if (fitted.layout.frame.height <= input.metrics.height) break;
  }
  return best?.fitted ?? null;
};

const polished = ({ layout, scale, grow }: Fitted, input: FitInput): OverlayLayout => {
  const better = attemptLayout({ ...input, polish: true }, scale, grow);
  return better.clear && layoutCost(better) <= layoutCost(layout) ? better : layout;
};

const fitLayout = (input: FitInput): OverlayLayout => {
  const top = topScale(input);
  const fitted = scaledLayout(input, top);
  return fitted ? polished(fitted, input) : shrinkLayout(input, top);
};

export { fitLayout };
