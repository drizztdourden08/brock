/* @layer renderer-shell @kind logic */
import type { WidgetWindowOpen } from '@drizztdourden08/brock-core';
import type { ScreenPoint, WidgetGates, WidgetLayout } from '@drizztdourden08/tessera/composites';
import { dragRelease } from './drag-release';
import { poppedShown } from './popped-shown';
import { poppedWindows } from './popped-windows';
import type { WidgetDef } from './widget.type';

const dragOutPlace = (point?: ScreenPoint): Partial<WidgetWindowOpen> =>
  (point ? { at: { x: point.screenX, y: point.screenY } } : { atCursor: dragRelease.releasing() });

const popOutWindow = (layout: WidgetLayout, gates: WidgetGates<WidgetDef>, id: string, extra: Partial<WidgetWindowOpen>, point?: ScreenPoint): void => {
  const facts = { ...layout.poppedMemory?.[id], id };
  if (poppedShown({ ...layout, popped: [facts] }, gates).length === 0) return;
  poppedWindows.open(facts, { ...extra, ...dragOutPlace(point) });
};

export { popOutWindow };
