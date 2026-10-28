/* @layer renderer-shell @kind hook */
import { useSyncExternalStore } from 'react';
import type { DragSession } from './dnd.type';
import { dragSession } from './drag-session';

const useDragSession = (): DragSession | null => useSyncExternalStore(dragSession.subscribe, dragSession.get, dragSession.get);

export { useDragSession };
