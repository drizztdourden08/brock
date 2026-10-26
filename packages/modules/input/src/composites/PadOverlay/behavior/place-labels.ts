/* @layer renderer-components @kind logic */
import { POLISH_ROUNDS } from '../PadOverlay.constants';
import type { PlacedLabel } from '../PadOverlay.type';
import { optionFits } from './option-fits';
import { placedLabelOf } from './placed-label-of';
import { refineLabels } from './refine-labels';
import { regroupLabels } from './regroup-labels';
import { searchLabels } from './search-labels';
import { searchPriority } from './search-priority';
import { wantsTop } from './wants-top';
import type { Choice, LabelOption, Occupied, Placement, Scene } from './placement.type';

const tryOrder = (order: readonly number[], options: readonly LabelOption[][]): Choice[] => {
  const occupied: Occupied = { rects: [], segments: [] };
  const chosen: Choice[] = options.map(() => null);
  order.forEach((index) => {
    const pick = options[index]?.find((option) => optionFits(option, occupied)) ?? null;
    chosen[index] = pick;
    if (!pick) return;
    occupied.rects.push(pick.spot.rect);
    occupied.segments.push(...pick.segments);
  });
  return chosen;
};

const ordersOf = (options: readonly LabelOption[][]): number[][] => {
  const indices = options.map((_, index) => index);
  const byCount = [...indices].sort((a, b) => (options[a]?.length ?? 0) - (options[b]?.length ?? 0));
  const byCost = [...indices].sort((a, b) => (options[b]?.[0]?.cost ?? 0) - (options[a]?.[0]?.cost ?? 0));
  return [byCount, byCost, indices, [...byCount].reverse()];
};

const refined = (picks: readonly Choice[], options: readonly LabelOption[][], polish: boolean): Choice[] => {
  const full = picks.flatMap((pick) => (pick ? [pick] : []));
  return full.length === picks.length ? regroupLabels(options, refineLabels(options, full), polish ? POLISH_ROUNDS : 0) : [...picks];
};

const missing = (chosen: readonly Choice[]): number => chosen.filter((pick) => pick === null).length;

const placeLabels = (scene: Scene, options: readonly LabelOption[][], polish: boolean): Placement => {
  const first = scene.parts.flatMap((part, index) => (wantsTop(part, scene) ? [index] : []));
  let best: Choice[] | null = searchPriority(options, first) ?? searchLabels(options);
  for (const order of best ? [] : ordersOf(options)) {
    const chosen = tryOrder(order, options);
    if (!best || missing(chosen) < missing(best)) best = chosen;
    if (missing(best) === 0) break;
  }
  const picks = refined(best ?? [], options, polish);
  const labels: PlacedLabel[] = picks.flatMap((pick, index) => {
    const part = scene.parts[index];
    const option = pick ?? options[index]?.[0];
    return part && option ? [placedLabelOf(part, option)] : [];
  });
  return { labels, clear: missing(picks) === 0 && labels.length === scene.parts.length };
};

export { placeLabels };
