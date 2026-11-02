/* @layer renderer-shell @kind logic */
import type { DndElement, DragPoint, IndexAmongAxis, MeasuredItem, MeasuredList } from './dnd.type';

const isMeasuredList = (element: DndElement): element is DndElement & MeasuredList => 'querySelectorAll' in element && typeof element.querySelectorAll === 'function';

const midpoint = (item: MeasuredItem, axis: IndexAmongAxis): number => {
  const box = item.getBoundingClientRect();
  return axis === 'x' ? (box.left + box.right) / 2 : (box.top + box.bottom) / 2;
};

const indexAmong = (selector: string, axis: IndexAmongAxis = 'x') => (point: DragPoint, element: DndElement): number | null => {
  if (!isMeasuredList(element)) return null;
  const at = axis === 'x' ? point.x : point.y;
  return Array.from(element.querySelectorAll(selector)).filter((item) => midpoint(item, axis) < at).length;
};

export { indexAmong };
