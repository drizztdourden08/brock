/* @layer renderer-shell @kind hook */
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { DndElement, DropTargetOptions } from './dnd.type';
import { dropTarget } from './drop-target';

const useDropTarget = <T,>(ref: RefObject<DndElement | null>, options: DropTargetOptions<T>): void => {
  const latest = useRef(options);
  latest.current = options;
  const accepts = Array.isArray(options.accepts) ? options.accepts : [options.accepts];
  const acceptKey = accepts.map((type: { name: string }) => type.name).join('|');

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    return dropTarget<T>(element, {
      accepts: latest.current.accepts,
      onDrop: (payload, info) => latest.current.onDrop(payload, info),
      canDrop: (payload, info) => latest.current.canDrop?.(payload, info) ?? true,
      feedback: (feedback) => latest.current.feedback?.(feedback),
      index: (point, el) => latest.current.index?.(point, el) ?? null,
    });
  }, [ref, acceptKey]);
};

export { useDropTarget };
