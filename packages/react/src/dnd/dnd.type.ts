/* @layer renderer-shell @kind types */
import type { DocumentDropKind } from '@drizztdourden08/brock-core';
import type { PathDropOptions, RejectedFile } from './path-drop.type';

interface DragType<T> {
  readonly name: string;
  readonly payload?: T;
}

interface DndElement extends EventTarget {
  setAttribute: (name: string, value: string) => void;
  removeAttribute: (name: string) => void;
  contains: (other: Node | null) => boolean;
}

interface DragPoint {
  x: number;
  y: number;
}

type DropPhase = 'enter' | 'over' | 'leave' | 'drop';

interface DropFeedback<T> {
  phase: DropPhase;
  accepted: boolean;
  type: string;
  payload: T | null;
  point: DragPoint;
  index: number | null;
}

interface DropInfo {
  type: string;
  point: DragPoint;
  index: number | null;
  source: DndElement | null;
}

interface DragEnd {
  dropped: boolean;
  target: DndElement | null;
}

interface DragPreviewOptions<T> {
  label: string | ((payload: T) => string);
  count?: number | ((payload: T) => number);
}

interface DragSourceOptions<T> {
  type: DragType<T>;
  payload: T | (() => T);
  disabled?: boolean | (() => boolean);
  onStart?: (payload: T) => void;
  onEnd?: (end: DragEnd) => void;
  preview?: DragPreviewOptions<T>;
}

interface DropTargetOptions<T> {
  accepts: DragType<T> | readonly DragType<T>[];
  onDrop: (payload: T, info: DropInfo) => void;
  canDrop?: (payload: T, info: DropInfo) => boolean;
  feedback?: (feedback: DropFeedback<T>) => void;
  index?: (point: DragPoint, element: DndElement) => number | null;
  paths?: PathDropOptions;
}

interface DroppedFile {
  file: File;
  name: string;
  path: string | null;
  kind: DocumentDropKind;
}

interface DroppedFiles {
  files: DroppedFile[];
  rejected: RejectedFile[];
}

interface DragSession {
  type: string;
  payload: unknown;
}

type IndexAmongAxis = 'x' | 'y';

interface MeasuredItem {
  getBoundingClientRect: () => { left: number; right: number; top: number; bottom: number };
}

interface MeasuredList {
  querySelectorAll: (selector: string) => ArrayLike<MeasuredItem>;
}

interface DragOutHost {
  start: (paths: readonly string[]) => Promise<boolean>;
}

export type { DndElement, DragEnd, DragOutHost, DragPoint, DragPreviewOptions, DragSession, DragSourceOptions, DragType, DroppedFile, DroppedFiles, DropFeedback, DropInfo, DropPhase, DropTargetOptions, IndexAmongAxis, MeasuredItem, MeasuredList, RejectedFile };
