/* @layer renderer-shell @kind logic */
import { isToolbarShown, moveToolbar, moveToolbarToSide } from '@drizztdourden08/tessera/composites';
import type { ToolbarLayout, ToolbarSide } from '@drizztdourden08/tessera/composites';
import { toolbarLabelsOn } from './toolbar-labels-on';
import { TOOLBAR_SIDE_ORDER } from './toolbar.constants';
import type { ToolbarDef, ToolbarListener, ToolbarSnapshot } from './toolbar.type';
import { useToolbarLayoutStore } from './useToolbarLayoutStore';

const store = () => useToolbarLayoutStore.getState();

const knownToolbar = (id: string): ToolbarDef => {
  const { definitions } = store();
  const found = definitions.find((def) => def.id === id);
  if (found) return found;
  throw new Error(`Unknown toolbar "${id}". Known toolbars: ${definitions.map((def) => def.id).join(', ') || 'none'}.`);
};

const placeOf = (layout: ToolbarLayout, id: string): Pick<ToolbarSnapshot, 'side' | 'row' | 'index'> => {
  for (const side of TOOLBAR_SIDE_ORDER) {
    const lanes = layout.sides[side];
    const row = lanes.findIndex((lane) => lane.some((place) => place.id === id));
    const lane = lanes[row];
    if (lane) return { side, row, index: lane.findIndex((place) => place.id === id) };
  }
  return { side: null, row: null, index: null };
};

const list = (): ToolbarSnapshot[] => {
  const { definitions, layout } = store();
  return definitions.map((def) => ({
    id: def.id,
    label: def.label,
    shown: isToolbarShown(layout, def.id),
    ...placeOf(layout, def.id),
    labels: toolbarLabelsOn(layout, def.id),
  }));
};

const show = (id: string): void => {
  knownToolbar(id);
  if (isToolbarShown(store().layout, id)) return;
  store().toggle(id);
  if (!isToolbarShown(store().layout, id)) throw new Error(`There is no room to show toolbar "${id}".`);
};

const hide = (id: string): void => {
  knownToolbar(id);
  store().hide(id);
};

const moveToSide = (id: string, side: ToolbarSide, row?: number): void => {
  knownToolbar(id);
  if (!TOOLBAR_SIDE_ORDER.includes(side)) throw new Error(`Unknown side "${String(side)}". Use top, bottom, left or right.`);
  if (row !== undefined && !(Number.isInteger(row) && row >= 0)) throw new Error('row must be a whole number, 0 or more.');
  show(id);
  const { layout } = store();
  const next = row === undefined ? moveToolbarToSide(layout, id, side) : moveToolbar(layout, id, side, row);
  if (next === layout && placeOf(layout, id).side !== side) throw new Error(`There is no room on the ${side} side for toolbar "${id}".`);
  store().setLayout(next);
};

const labels = (id: string, on: boolean): void => {
  knownToolbar(id);
  store().setLabels(id, on);
};

const subscribe = (listener: ToolbarListener): (() => void) => {
  let last = JSON.stringify(list());
  return useToolbarLayoutStore.subscribe(() => {
    const next = list();
    const key = JSON.stringify(next);
    if (key === last) return;
    last = key;
    listener(next);
  });
};

const toolbars = { list, show, hide, moveToSide, labels, reset: (): void => store().reset(), subscribe };

export { toolbars };
