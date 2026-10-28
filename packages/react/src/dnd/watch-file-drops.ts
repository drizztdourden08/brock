/* @layer renderer-shell @kind logic */
import { FILES_DRAG_TYPE, FILES_TRANSFER_TYPE } from './dnd.constants';
import type { DragPoint } from './dnd.type';
import { sendFeedback } from './drop-feedback';
import { resolveDroppedFiles } from './resolve-dropped-files';
import type { Hover, Probe, TargetEntry } from './target-entry.type';

const carriesFiles = (event: DragEvent): boolean => event.dataTransfer?.types.includes(FILES_TRANSFER_TYPE) === true;

const probeOf = (event: DragEvent): Probe => ({ point: { x: event.clientX, y: event.clientY }, type: FILES_DRAG_TYPE, payload: null, source: null });

const indexAt = (entry: TargetEntry, point: DragPoint): number | null => entry.options.index?.(point, entry.element) ?? null;

const watchFileDrops = (entry: TargetEntry): (() => void) => {
  let hover: Hover | null = null;

  const leave = (probe: Probe): void => {
    if (hover) sendFeedback(hover, 'leave', probe);
    hover = null;
  };

  const over = (event: Event): void => {
    const drag = event as DragEvent;
    if (!carriesFiles(drag)) return;
    drag.preventDefault();
    if (drag.dataTransfer) drag.dataTransfer.dropEffect = 'copy';
    const probe = probeOf(drag);
    const next: Hover = { entry, accepted: true, index: indexAt(entry, probe.point) };
    if (hover?.index !== next.index) sendFeedback(next, hover ? 'over' : 'enter', probe);
    hover = next;
  };

  const out = (event: Event): void => {
    const drag = event as DragEvent;
    if (drag.relatedTarget instanceof Node && entry.element.contains(drag.relatedTarget)) return;
    leave(probeOf(drag));
  };

  const drop = (event: Event): void => {
    const drag = event as DragEvent;
    if (!carriesFiles(drag)) return;
    drag.preventDefault();
    const probe = probeOf(drag);
    const list = [...(drag.dataTransfer?.files ?? [])];
    leave(probe);
    void resolveDroppedFiles(list).then((dropped) => {
      const info = { type: FILES_DRAG_TYPE, point: probe.point, index: indexAt(entry, probe.point), source: null };
      if (entry.options.canDrop?.(dropped, info) ?? true) entry.options.onDrop(dropped, info);
    });
  };

  const listeners = { dragenter: over, dragover: over, dragleave: out, drop };
  for (const [name, listener] of Object.entries(listeners)) entry.element.addEventListener(name, listener);
  return () => {
    for (const [name, listener] of Object.entries(listeners)) entry.element.removeEventListener(name, listener);
  };
};

export { watchFileDrops };
