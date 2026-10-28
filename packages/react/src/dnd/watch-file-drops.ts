/* @layer renderer-shell @kind logic */
import { FILES_DRAG_TYPE, FILES_TRANSFER_TYPE } from './dnd.constants';
import type { DragPoint } from './dnd.type';
import { sendFeedback } from './drop-feedback';
import { resolveDroppedFiles } from './resolve-dropped-files';
import type { Hover, TargetEntry } from './target-entry.type';

const carriesFiles = (event: DragEvent): boolean => event.dataTransfer?.types.includes(FILES_TRANSFER_TYPE) === true;

const pointOf = (event: DragEvent): DragPoint => ({ x: event.clientX, y: event.clientY });

const watchFileDrops = (entry: TargetEntry): (() => void) => {
  let hover: Hover | null = null;

  const leave = (point: DragPoint): void => {
    if (hover) sendFeedback(hover, 'leave', point, FILES_DRAG_TYPE, null);
    hover = null;
  };

  const over = (event: Event): void => {
    const drag = event as DragEvent;
    if (!carriesFiles(drag)) return;
    drag.preventDefault();
    if (drag.dataTransfer) drag.dataTransfer.dropEffect = 'copy';
    const point = pointOf(drag);
    const next: Hover = { entry, accepted: true, index: entry.options.index?.(point, entry.element) ?? null };
    if (!hover || hover.index !== next.index) sendFeedback(next, hover ? 'over' : 'enter', point, FILES_DRAG_TYPE, null);
    hover = next;
  };

  const out = (event: Event): void => {
    const drag = event as DragEvent;
    if (drag.relatedTarget instanceof Node && entry.element.contains(drag.relatedTarget)) return;
    leave(pointOf(drag));
  };

  const drop = (event: Event): void => {
    const drag = event as DragEvent;
    if (!carriesFiles(drag)) return;
    drag.preventDefault();
    const point = pointOf(drag);
    const list = [...(drag.dataTransfer?.files ?? [])];
    leave(point);
    void resolveDroppedFiles(list).then((dropped) => {
      const info = { type: FILES_DRAG_TYPE, point, index: entry.options.index?.(point, entry.element) ?? null, source: null };
      if (entry.options.canDrop?.(dropped, info) ?? true) entry.options.onDrop(dropped, info);
    });
  };

  entry.element.addEventListener('dragenter', over);
  entry.element.addEventListener('dragover', over);
  entry.element.addEventListener('dragleave', out);
  entry.element.addEventListener('drop', drop);
  return () => {
    entry.element.removeEventListener('dragenter', over);
    entry.element.removeEventListener('dragover', over);
    entry.element.removeEventListener('dragleave', out);
    entry.element.removeEventListener('drop', drop);
  };
};

export { watchFileDrops };
