/* @layer electron-main @kind logic */
import { DROP_TICKET_PATH_LIMIT } from './drop-ticket.constants';

interface DropEventLike {
  isTrusted: boolean;
  dataTransfer: { files: ArrayLike<File> } | null;
}

interface DropTarget {
  addEventListener(type: 'drop', listener: (event: DropEventLike) => void, capture: boolean): void;
}

const droppedPaths = (event: DropEventLike, pathOf: (file: File) => string): string[] => {
  const files = Array.from(event.dataTransfer?.files ?? []).slice(0, DROP_TICKET_PATH_LIMIT);
  const paths: string[] = [];
  for (const file of files) {
    try {
      const path = pathOf(file);
      if (path !== '') paths.push(path);
    } catch {
      continue;
    }
  }
  return paths;
};

const captureDrops = (target: DropTarget, pathOf: (file: File) => string, send: (paths: string[]) => void): void => {
  target.addEventListener(
    'drop',
    (event) => {
      if (!event.isTrusted) return;
      const paths = droppedPaths(event, pathOf);
      if (paths.length > 0) send(paths);
    },
    true,
  );
};

export { captureDrops };
