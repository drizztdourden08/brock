/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { boundsUnion } from './bounds-union';
import { mapIntoArea } from './map-into-area';
import { packLines } from './pack-lines';
import type { MinSize } from './widget-windows.type';

const fitIntoArea = (members: readonly WidgetWindowBounds[], mins: readonly MinSize[], area: WidgetWindowBounds): WidgetWindowBounds[] => {
  const box = boundsUnion(members);
  if (!box) return [];
  const scaled = members.map((member) => mapIntoArea(member, box, area));
  const xs = packLines(scaled.map((b) => ({ start: b.x, length: b.width })), mins.map((min) => min.width), { start: area.x, length: area.width });
  const ys = packLines(scaled.map((b) => ({ start: b.y, length: b.height })), mins.map((min) => min.height), { start: area.y, length: area.height });
  return scaled.map((_, index) => ({
    x: xs[index]?.start ?? area.x, y: ys[index]?.start ?? area.y, width: xs[index]?.length ?? area.width, height: ys[index]?.length ?? area.height,
  }));
};

export { fitIntoArea };
