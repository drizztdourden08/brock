/* @layer renderer-shell @kind logic */
import type { DragOutHost } from './dnd.type';

let host: DragOutHost | null = null;

const setDragOutHost = (next: DragOutHost | null): void => {
  host = next;
};

const dragOut = (paths: readonly string[]): Promise<boolean> => (host && paths.length > 0 ? host.start(paths) : Promise.resolve(false));

export { dragOut, setDragOutHost };
