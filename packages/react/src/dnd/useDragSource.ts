/* @layer renderer-shell @kind hook */
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { DndElement, DragSourceOptions } from './dnd.type';
import { dragSource } from './drag-source';

const useDragSource = <T,>(ref: RefObject<DndElement | null>, options: DragSourceOptions<T>): void => {
  const latest = useRef(options);
  latest.current = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    return dragSource<T>(element, {
      get type() { return latest.current.type; },
      get payload() { return latest.current.payload; },
      get disabled() { return latest.current.disabled; },
      onStart: (payload) => latest.current.onStart?.(payload),
      onEnd: (end) => latest.current.onEnd?.(end),
    });
  }, [ref]);
};

export { useDragSource };
