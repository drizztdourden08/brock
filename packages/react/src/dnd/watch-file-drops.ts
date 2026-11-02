/* @layer renderer-shell @kind logic */
import { claimDrop } from './claim-drop';
import { isClaimed } from './is-claimed';
import { FILES_DRAG_TYPE, FILES_TRANSFER_TYPE, PATHS_DRAG_TYPE } from './dnd.constants';
import type { DragPoint } from './dnd.type';
import { deliverFileDrop } from './deliver-file-drop';
import { sendFeedback } from './drop-feedback';
import type { Hover, Probe, TargetEntry } from './target-entry.type';

const carriesFiles = (event: DragEvent): boolean => event.dataTransfer?.types.includes(FILES_TRANSFER_TYPE) === true;

const indexAt = (entry: TargetEntry, point: DragPoint): number | null => entry.options.index?.(point, entry.element) ?? null;

const watchFileDrops = (entry: TargetEntry): (() => void) => {
  const type = entry.names.has(FILES_DRAG_TYPE) ? FILES_DRAG_TYPE : PATHS_DRAG_TYPE;
  const probeOf = (event: DragEvent): Probe => ({ point: { x: event.clientX, y: event.clientY }, type, payload: null, source: null });
  let hover: Hover | null = null;

  const leave = (probe: Probe): void => {
    if (hover) sendFeedback(hover, 'leave', probe);
    hover = null;
  };

  const yields = (drag: DragEvent): boolean => {
    if (!entry.windowWide) {
      claimDrop(drag);
      return false;
    }
    if (!isClaimed(drag)) return false;
    leave(probeOf(drag));
    return true;
  };

  const over = (event: Event): void => {
    const drag = event as DragEvent;
    if (!carriesFiles(drag) || yields(drag)) return;
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
    if (!carriesFiles(drag) || yields(drag)) return;
    drag.preventDefault();
    const probe = probeOf(drag);
    const list = [...(drag.dataTransfer?.files ?? [])];
    leave(probe);
    void deliverFileDrop(entry, list, { type, point: probe.point, index: indexAt(entry, probe.point), source: null });
  };

  const listeners = { dragenter: over, dragover: over, dragleave: out, drop };
  for (const [name, listener] of Object.entries(listeners)) entry.element.addEventListener(name, listener);
  return () => {
    for (const [name, listener] of Object.entries(listeners)) entry.element.removeEventListener(name, listener);
  };
};

export { watchFileDrops };
