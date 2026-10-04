/* @layer electron-main @kind test */
interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SimInsets {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface SimWindowOptions {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  title?: string;
  insets?: SimInsets;
}

interface DragStep {
  dx: number;
  dy: number;
}

type DragEdge = 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface DragOptions {
  stepMs?: number;
  onStep?: (index: number) => void;
  cancel?: boolean;
}

export type { DragEdge, DragOptions, DragStep, Rect, SimInsets, SimWindowOptions };
