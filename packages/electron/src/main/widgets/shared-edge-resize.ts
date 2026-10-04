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
const facingOf = (b: WidgetWindowBounds, side: EdgeSide): number => (side.far ? startOf(b, side.axis) : endOf(b, side.axis));
const minOf = (w: EdgeWindow, axis: Axis): number => (axis === 'x' ? w.min.width : w.min.height);
const near = (a: number, b: number, tolerance: number): boolean => Math.abs(a - b) <= tolerance;

const withSpan = (b: WidgetWindowBounds, axis: Axis, start: number, end: number): WidgetWindowBounds =>
  (axis === 'x' ? { ...b, x: start, width: end - start } : { ...b, y: start, height: end - start });

const stacked = (a: WidgetWindowBounds, b: WidgetWindowBounds, cross: Axis, tolerance: number): boolean =>
  near(startOf(a, cross), endOf(b, cross), tolerance) || near(endOf(a, cross), startOf(b, cross), tolerance);

const overlapsAny = (w: WidgetWindowBounds, chain: readonly WidgetWindowBounds[], cross: Axis): boolean =>
  chain.some((c) => spansOverlap(startOf(w, cross), lengthOf(w, cross), startOf(c, cross), lengthOf(c, cross)));

const columnOf = (moving: WidgetWindowBounds, scan: EdgeScan): EdgeWindow[] => {
  const { others, side, tolerance } = scan;
  const line = lineOf(moving, side);
  const cross = crossOf(side.axis);
  const chain: EdgeWindow[] = [];
  const bounds = (): WidgetWindowBounds[] => [moving, ...chain.map((w) => w.bounds)];
  let grew = true;
  while (grew) {
    grew = false;
    for (const w of others) {
      if (chain.includes(w) || !near(lineOf(w.bounds, side), line, tolerance)) continue;
      if (!bounds().some((c) => stacked(w.bounds, c, cross, tolerance))) continue;
      chain.push(w);
      grew = true;
    }
  }
  return chain;
};

const facingOfColumn = (moving: WidgetWindowBounds, column: readonly EdgeWindow[], scan: EdgeScan): EdgeWindow[] => {
  const { others, side, tolerance } = scan;
  const line = lineOf(moving, side);
  const chain = [moving, ...column.map((w) => w.bounds)];
  return others.filter((w) => !column.includes(w) && near(facingOf(w.bounds, side), line, tolerance) && overlapsAny(w.bounds, chain, crossOf(side.axis)));
};

const clampLine = (wanted: number, column: readonly EdgeWindow[], facing: readonly EdgeWindow[], side: EdgeSide): number => {
  const { axis, far } = side;
  let line = wanted;
  for (const w of column) line = far ? Math.max(line, startOf(w.bounds, axis) + minOf(w, axis)) : Math.min(line, endOf(w.bounds, axis) - minOf(w, axis));
  for (const w of facing) line = far ? Math.min(line, endOf(w.bounds, axis) - minOf(w, axis)) : Math.max(line, startOf(w.bounds, axis) + minOf(w, axis));
  return line;
};

const moveSide = (before: WidgetWindowBounds, after: WidgetWindowBounds, scan: EdgeScan): SharedResize => {
  const { side } = scan;
  const { axis, far } = side;
  const column = columnOf(before, scan);
  const facing = facingOfColumn(before, column, scan);
  if (column.length === 0 && facing.length === 0) return { bounds: after, moves: [] };
  const line = clampLine(lineOf(after, side), column, facing, side);
  const bounds = far ? withSpan(after, axis, startOf(after, axis), line) : withSpan(after, axis, line, endOf(after, axis));
  const moves: EdgeMove[] = [
    ...column.map((w) => ({ id: w.id, bounds: far ? withSpan(w.bounds, axis, startOf(w.bounds, axis), line) : withSpan(w.bounds, axis, line, endOf(w.bounds, axis)) })),
    ...facing.map((w) => ({ id: w.id, bounds: far ? withSpan(w.bounds, axis, line, endOf(w.bounds, axis)) : withSpan(w.bounds, axis, startOf(w.bounds, axis), line) })),
  ];
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
