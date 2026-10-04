/* @layer renderer-shell @kind logic */
import type { WidgetWindowPoint } from '@drizztdourden08/brock-core';
import { floatInMain, getWidgetDefinition } from '@drizztdourden08/tessera/composites';
import { LOGS_WIDGET_ID } from '../../widgets/built-in/LogsWidget/LogsWidget.constants';
import { useWidgetLayoutStore } from '../../widgets/useWidgetLayoutStore';
import { FLOATING_MIN } from '../../widgets/widget.constants';
import { widgetMainRect } from '../../widgets/widget-main-rect';
import { widgets } from '../../widgets/widgets';
import { find } from '../dom/find';
import { settle } from '../dom/settle';
import { waitFor } from '../dom/wait-for';
import { closeMenu } from '../menu/close-menu';
import type { StepTour } from '../review.type';
import { probe } from './probe';
import { FLOAT_HANDLE, FLOAT_SHRINK, FLOAT_TOLERANCE, GROW, MAIN_LINK, MAIN_VIEW } from './widget-review.constants';

const frameOf = (id: string): HTMLElement | null => find(`.dock-layout__floating[data-floating-id="${id}"]`);

const sizeText = (box: DOMRect | undefined): string => `${Math.round(box?.width ?? 0)}x${Math.round(box?.height ?? 0)}`;

const handlePoint = (id: string): WidgetWindowPoint | null => {
  const box = frameOf(id)?.querySelector<HTMLElement>(FLOAT_HANDLE)?.getBoundingClientRect();
  return box ? { x: box.left + box.width / 2, y: box.top + box.height / 2 } : null;
};

const sized = (box: DOMRect | undefined, width: number, height: number): boolean =>
  box !== undefined && Math.abs(box.width - width) <= FLOAT_TOLERANCE && Math.abs(box.height - height) <= FLOAT_TOLERANCE;

const grownSize = (start: DOMRect): { width: number; height: number } => {
  const main = find(MAIN_VIEW)?.getBoundingClientRect();
  const width = start.width + GROW;
  const height = start.height + GROW;
  return main ? { width: Math.min(width, main.right - start.left), height: Math.min(height, main.bottom - start.top) } : { width, height };
};

const mouse = (action: 'down' | 'move' | 'up', point: WidgetWindowPoint) => probe({ kind: 'mouse', id: MAIN_LINK, action, point });

const dragHandle = async (from: WidgetWindowPoint, by: number, during?: () => Promise<void>): Promise<void> => {
  const to = { x: from.x + by, y: from.y + by };
  await mouse('down', from);
  await mouse('move', { x: from.x + by / 2, y: from.y + by / 2 });
  await mouse('move', to);
  await during?.();
  await mouse('up', to);
  await settle();
};

const floatOut = async (id: string): Promise<WidgetWindowPoint | null> => {
  const main = widgetMainRect.current;
  if (!main) return null;
  const store = useWidgetLayoutStore.getState();
  store.change((layout) => floatInMain(layout, id, main, getWidgetDefinition(store.definitions, id)));
  return (await waitFor(() => frameOf(id))) ? handlePoint(id) : null;
};

const checkGrow = async (tour: StepTour, id: string, from: WidgetWindowPoint): Promise<void> => {
  const start = frameOf(id)?.getBoundingClientRect();
  const live = { resizing: false };
  await dragHandle(from, GROW, async () => {
    live.resizing = frameOf(id)?.classList.contains('dock-layout__floating--resizing') === true;
    await settle();
    await tour.capture('floating-resize');
  });
  const grown = frameOf(id)?.getBoundingClientRect();
  const expected = start ? grownSize(start) : null;
  const resized = live.resizing && expected !== null && sized(grown, expected.width, expected.height);
  tour.check(
    'floating-widget-resizes',
    resized,
    `dragging the corner of the floating "${id}" widget grew it by up to ${GROW} pixels each way, inside the main view, and kept the size`,
    `the floating "${id}" widget went from ${sizeText(start)} to ${sizeText(grown)}, expected ${Math.round(expected?.width ?? 0)}x${Math.round(expected?.height ?? 0)} (resizing shown: ${String(live.resizing)})`,
  );
};

const checkFloor = async (tour: StepTour, id: string): Promise<void> => {
  const from = handlePoint(id);
  if (from) await dragHandle(from, -FLOAT_SHRINK);
  const least = frameOf(id)?.getBoundingClientRect();
  tour.check(
    'floating-widget-min',
    sized(least, FLOATING_MIN.width, FLOATING_MIN.height),
    `shrinking the floating "${id}" widget stopped at ${FLOATING_MIN.width}x${FLOATING_MIN.height}`,
    `shrinking the floating "${id}" widget stopped at ${sizeText(least)}, expected ${FLOATING_MIN.width}x${FLOATING_MIN.height}`,
  );
};

const checkFloatResize = async (tour: StepTour): Promise<void> => {
  const id = LOGS_WIDGET_ID;
  await closeMenu();
  const from = await floatOut(id);
  if (from) {
    await checkGrow(tour, id, from);
    await checkFloor(tour, id);
  } else {
    tour.check('floating-widget-resizes', false, '', `the "${id}" widget did not float in the main view with resize handles`);
  }
  widgets.close(id);
  await waitFor(() => frameOf(id) === null);
};

export { checkFloatResize };
