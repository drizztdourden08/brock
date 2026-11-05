/* @layer renderer-components @kind types */
import type { DragEventHandler, ReactNode } from 'react';

interface BindingSectionProps {
  title?: string;
  dragOver?: boolean;
  onDragOver?: DragEventHandler;
  onDragLeave?: DragEventHandler;
  onDrop?: DragEventHandler;
  children: ReactNode;
}

export type { BindingSectionProps };
