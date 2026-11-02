/* @layer electron-main @kind types */
interface DropEventLike {
  isTrusted: boolean;
  dataTransfer: { files: ArrayLike<File> } | null;
}

interface DropTarget {
  addEventListener(type: 'drop', listener: (event: DropEventLike) => void, capture: boolean): void;
}

export type { DropEventLike, DropTarget };
