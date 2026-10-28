/* @layer renderer-shell @kind types */
import type { DocumentDropKind } from '@drizztdourden08/brock-core';

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

interface DragSourceOptions<T> {
  type: DragType<T>;
  payload: T | (() => T);
  disabled?: boolean | (() => boolean);
  onStart?: (payload: T) => void;
  onEnd?: (end: DragEnd) => void;
}

interface DropTargetOptions<T> {
  accepts: DragType<T> | readonly DragType<T>[];
  onDrop: (payload: T, info: DropInfo) => void;
  canDrop?: (payload: T, info: DropInfo) => boolean;
  feedback?: (feedback: DropFeedback<T>) => void;
  index?: (point: DragPoint, element: DndElement) => number | null;
}

interface DroppedFile {
  file: File;
  name: string;
  path: string | null;
  kind: DocumentDropKind;
}

interface RejectedFile {
  name: string;
  reason: string;
}

interface DroppedFiles {
  files: DroppedFile[];
  rejected: RejectedFile[];
}

interface DragSession {
  type: string;
  payload: unknown;
}

interface DragOutHost {
  start: (paths: readonly string[]) => Promise<boolean>;
}

export type { DndElement, DragEnd, DragOutHost, DragPoint, DragSession, DragSourceOptions, DragType, DroppedFile, DroppedFiles, DropFeedback, DropInfo, DropPhase, DropTargetOptions, RejectedFile };
