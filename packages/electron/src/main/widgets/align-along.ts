/* @layer electron-main @kind logic */
import { nearestLine } from './nearest-line';
import type { Span } from './widget-windows.type';

const alignAlong = (own: Span, others: readonly Span[], reach: number): number =>
  nearestLine(own.start, others.flatMap((other) => {
    const end = other.start + other.length;
    return [other.start, end - own.length, end, other.start - own.length];
  }), reach);

export { alignAlong };
