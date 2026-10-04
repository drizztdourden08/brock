/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { alignAlong } from './align-along';
import { isAcross } from './is-across';
import { spansNear } from './spans-near';
import { spansOverlap } from './spans-overlap';
import { SNAP_DISTANCE } from './widget-windows.constants';
import type { SnapCandidate, SnapTarget, Snapped, Span } from './widget-windows.type';

const spanOf = (bounds: WidgetWindowBounds, across: boolean): Span =>
  (across ? { start: bounds.y, length: bounds.height } : { start: bounds.x, length: bounds.width });

const besideCandidates = (moving: WidgetWindowBounds, target: WidgetWindowBounds, reach: number): SnapCandidate[] => {
  if (!spansNear(spanOf(moving, true), spanOf(target, true), reach)) return [];
  const rightOf = target.x + target.width;
  return [
    { edge: 'right', distance: Math.abs(moving.x - rightOf), x: rightOf, y: moving.y },
    { edge: 'left', distance: Math.abs(moving.x + moving.width - target.x), x: target.x - moving.width, y: moving.y },
  ];
};

const stackedCandidates = (moving: WidgetWindowBounds, target: WidgetWindowBounds, reach: number): SnapCandidate[] => {
  if (!spansNear(spanOf(moving, false), spanOf(target, false), reach)) return [];
  const below = target.y + target.height;
  return [
    { edge: 'bottom', distance: Math.abs(moving.y - below), x: moving.x, y: below },
    { edge: 'top', distance: Math.abs(moving.y + moving.height - target.y), x: moving.x, y: target.y - moving.height },
  ];
};

const cornered = (moving: WidgetWindowBounds, candidate: SnapCandidate, targets: readonly SnapTarget[], reach: number): WidgetWindowBounds => {
  const across = isAcross(candidate.edge);
  const placed = { ...moving, x: candidate.x, y: candidate.y };
  const along = alignAlong(spanOf(placed, across), targets.map((target) => spanOf(target.bounds, across)), reach);
  return across ? { ...placed, y: along } : { ...placed, x: along };
};

const touching = (own: Span, other: Span): boolean => own.start === other.start + other.length || own.start + own.length === other.start;

const placeCandidate = (moving: WidgetWindowBounds, candidate: SnapCandidate, target: SnapTarget, targets: readonly SnapTarget[]): Snapped | null => {
  const bounds = cornered(moving, candidate, targets, SNAP_DISTANCE);
  const across = isAcross(candidate.edge);
  const own = spanOf(bounds, across);
  const other = spanOf(target.bounds, across);
  if (spansOverlap(own.start, own.length, other.start, other.length)) return { bounds, link: { to: target.to, edge: candidate.edge } };
  return touching(own, other) ? { bounds, link: null } : null;
};

const snapTo = (moving: WidgetWindowBounds, targets: readonly SnapTarget[], reach = SNAP_DISTANCE): Snapped | null => {
  let best: Snapped | null = null;
  let bestDistance = reach + 1;
  for (const target of targets) {
    const candidates = [...besideCandidates(moving, target.bounds, reach), ...stackedCandidates(moving, target.bounds, reach)];
    for (const candidate of candidates) {
      if (candidate.distance > reach || candidate.distance >= bestDistance) continue;
      const placed = placeCandidate(moving, candidate, target, targets);
      if (!placed) continue;
      best = placed;
      bestDistance = candidate.distance;
    }
  }
  return best;
};

export { snapTo };
