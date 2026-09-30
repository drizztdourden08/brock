/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { SNAP_DISTANCE } from './widget-windows.constants';
import type { SnapCandidate, SnapTarget, Snapped } from './widget-windows.type';

const spansOverlap = (aStart: number, aLength: number, bStart: number, bLength: number): boolean =>
  aStart < bStart + bLength && bStart < aStart + aLength;

const besideCandidates = (moving: WidgetWindowBounds, target: WidgetWindowBounds): SnapCandidate[] => {
  if (!spansOverlap(moving.y, moving.height, target.y, target.height)) return [];
  const rightOf = target.x + target.width;
  return [
    { edge: 'right', distance: Math.abs(moving.x - rightOf), x: rightOf, y: moving.y },
    { edge: 'left', distance: Math.abs(moving.x + moving.width - target.x), x: target.x - moving.width, y: moving.y },
  ];
};

const stackedCandidates = (moving: WidgetWindowBounds, target: WidgetWindowBounds): SnapCandidate[] => {
  if (!spansOverlap(moving.x, moving.width, target.x, target.width)) return [];
  const below = target.y + target.height;
  return [
    { edge: 'bottom', distance: Math.abs(moving.y - below), x: moving.x, y: below },
    { edge: 'top', distance: Math.abs(moving.y + moving.height - target.y), x: moving.x, y: target.y - moving.height },
  ];
};

const snapTo = (moving: WidgetWindowBounds, targets: readonly SnapTarget[], reach = SNAP_DISTANCE): Snapped | null => {
  let best: (SnapCandidate & { to: string }) | null = null;
  for (const target of targets) {
    const candidates = [...besideCandidates(moving, target.bounds), ...stackedCandidates(moving, target.bounds)];
    for (const candidate of candidates) {
      if (candidate.distance <= reach && (!best || candidate.distance < best.distance)) best = { ...candidate, to: target.to };
    }
  }
  if (!best) return null;
  return { bounds: { ...moving, x: best.x, y: best.y }, link: { to: best.to, edge: best.edge } };
};

export { snapTo };
