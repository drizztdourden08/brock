/* @layer renderer-shell @kind logic */
import { MODAL_SELECTOR } from '../regions/regions.constants';
import { anchorPoint } from './anchor-point';
import { buildEntries } from './build-entries';
import { CONTEXT_MENU_NAME } from './context-menu.constants';
import type { ContextMenuContext, ContextMenuPoint, OpenRequest, OpenResult, ZoneMatch } from './context-menu.type';
import { nativeHeld } from './native-held';
import { reportMenuSize } from './report-menu-size';
import { useContextMenuStore } from './useContextMenuStore';
import { zonesAt } from './zones-at';

const placeOf = (request: OpenRequest, first: ZoneMatch): { point: ContextMenuPoint; data: unknown } => {
  const data = request.data ?? first.data;
  if (request.point !== null) return { point: request.point, data };
  const anchor = first.config.anchor?.({ target: request.target, data });
  if (anchor === null || anchor === undefined) return { point: anchorPoint(request.target), data };
  return { point: { x: anchor.x, y: anchor.y }, data: anchor.data ?? data };
};

const labelOf = (first: ZoneMatch, context: ContextMenuContext): string => {
  const { label } = first.config;
  if (label === undefined) return CONTEXT_MENU_NAME;
  return typeof label === 'function' ? label(context) : label;
};

const openAtTarget = (request: OpenRequest): OpenResult => {
  const matches = zonesAt(request.target);
  const [first] = matches;
  if (first === undefined || nativeHeld(request.target)) return 'none';
  if (useContextMenuStore.getState().blocked || document.querySelector(MODAL_SELECTOR) !== null) return 'cancelled';
  const { point, data } = placeOf(request, first);
  const context: ContextMenuContext = { point, target: request.target, trigger: request.trigger, data };
  if (first.config.beforeOpen?.(context) === false) return 'cancelled';
  const entries = buildEntries(matches, context);
  reportMenuSize(first.zone, entries);
  useContextMenuStore.getState().show({ entries, point, context, label: labelOf(first, context) });
  return 'opened';
};

export { openAtTarget };
