/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import type { Span } from './widget-windows.type';

const scaleLine = (value: number, from: Span, to: Span): number =>
  (from.length > 0 ? Math.round(to.start + ((value - from.start) * to.length) / from.length) : to.start);

const mapIntoArea = (bounds: WidgetWindowBounds, box: WidgetWindowBounds, area: WidgetWindowBounds): WidgetWindowBounds => {
  const across = { from: { start: box.x, length: box.width }, to: { start: area.x, length: area.width } };
  const down = { from: { start: box.y, length: box.height }, to: { start: area.y, length: area.height } };
  const left = scaleLine(bounds.x, across.from, across.to);
  const right = scaleLine(bounds.x + bounds.width, across.from, across.to);
  const top = scaleLine(bounds.y, down.from, down.to);
  const bottom = scaleLine(bounds.y + bounds.height, down.from, down.to);
  return { x: left, y: top, width: right - left, height: bottom - top };
};

export { mapIntoArea };
