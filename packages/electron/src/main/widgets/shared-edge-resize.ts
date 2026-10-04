/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { spansOverlap } from './spans-overlap';
import { EDGE_SIDES } from './shared-edge-resize.constants';
import { FLUSH_TOLERANCE } from './widget-windows.constants';
import type { Axis, EdgeMove, EdgeScan, EdgeSide, EdgeWindow, SharedResize } from './widget-windows.type';

const crossOf = (axis: Axis): Axis => (axis === 'x' ? 'y' : 'x');
const startOf = (b: WidgetWindowBounds, axis: Axis): number => (axis === 'x' ? b.x : b.y);
const lengthOf = (b: WidgetWindowBounds, axis: Axis): number => (axis === 'x' ? b.width : b.height);
const endOf = (b: WidgetWindowBounds, axis: Axis): number => startOf(b, axis) + lengthOf(b, axis);
const lineOf = (b: WidgetWindowBounds, side: EdgeSide): number => (side.far ? endOf(b, side.axis) : startOf(b, side.axis));
const facingLineOf = (b: WidgetWindowBounds, side: EdgeSide): number => (side.far ? startOf(b, side.axis) : endOf(b, side.axis));
const minOf = (w: EdgeWindow, axis: Axis): number => (axis === 'x' ? w.min.width : w.min.height);

const withSpan = (b: WidgetWindowBounds, axis: Axis, start: number, end: number): WidgetWindowBounds =>
  (axis === 'x' ? { ...b, x: start, width: end - start } : { ...b, y: start, height: end - start });

const facingOf = (moving: WidgetWindowBounds, scan: EdgeScan): EdgeWindow[] => {
  const { others, side, tolerance } = scan;
  const line = lineOf(moving, side);
  const cross = crossOf(side.axis);
  return others.filter((w) => Math.abs(facingLineOf(w.bounds, side) - line) <= tolerance
    && spansOverlap(startOf(w.bounds, cross), lengthOf(w.bounds, cross), startOf(moving, cross), lengthOf(moving, cross)));
};

const clampLine = (wanted: number, facing: readonly EdgeWindow[], side: EdgeSide): number => {
  const { axis, far } = side;
  let line = wanted;
  for (const w of facing) line = far ? Math.min(line, endOf(w.bounds, axis) - minOf(w, axis)) : Math.max(line, startOf(w.bounds, axis) + minOf(w, axis));
  return line;
};

const moveSide = (before: WidgetWindowBounds, after: WidgetWindowBounds, scan: EdgeScan): SharedResize => {
  const { axis, far } = scan.side;
  const facing = facingOf(before, scan);
  if (facing.length === 0) return { bounds: after, moves: [] };
  const line = clampLine(lineOf(after, scan.side), facing, scan.side);
  const bounds = far ? withSpan(after, axis, startOf(after, axis), line) : withSpan(after, axis, line, endOf(after, axis));
  const moves: EdgeMove[] = facing.map((w) => ({
    id: w.id, bounds: far ? withSpan(w.bounds, axis, line, endOf(w.bounds, axis)) : withSpan(w.bounds, axis, startOf(w.bounds, axis), line),
  }));
  return { bounds, moves };
};

const mergeMoves = (moves: readonly EdgeMove[], next: readonly EdgeMove[], axis: Axis): EdgeMove[] => {
  const merged = new Map(moves.map((move) => [move.id, move.bounds]));
  for (const move of next) {
    const prior = merged.get(move.id);
    merged.set(move.id, prior ? withSpan(prior, axis, startOf(move.bounds, axis), endOf(move.bounds, axis)) : move.bounds);
  }
  return [...merged].map(([id, bounds]) => ({ id, bounds }));
};

const sharedEdgeResize = (before: WidgetWindowBounds, after: WidgetWindowBounds, others: readonly EdgeWindow[], tolerance = FLUSH_TOLERANCE): SharedResize => {
  let result: SharedResize = { bounds: after, moves: [] };
  for (const side of EDGE_SIDES) {
    if (lineOf(before, side) === lineOf(after, side)) continue;
    const step = moveSide(before, result.bounds, { others, side, tolerance });
    result = { bounds: step.bounds, moves: mergeMoves(result.moves, step.moves, side.axis) };
  }
  return result;
};

export { sharedEdgeResize };
