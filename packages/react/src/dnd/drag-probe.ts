/* @layer renderer-shell @kind logic */
import type { DragPoint } from './dnd.type';
import type { Run } from './drag-run.type';
import type { Probe } from './target-entry.type';

const probeOf = (active: Run, point: DragPoint): Probe => ({ point, type: active.options.type.name, payload: active.payload, source: active.element });

export { probeOf };
