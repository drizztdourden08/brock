/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { useInspectStore } from '../stores/useInspectStore';

const inside = (rect: DOMRect, event: PointerEvent): boolean =>
  event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;

const useInspectTracking = (box: RefObject<Element | null>): void => {
  useEffect(() => {
    const element = box.current;
    if (!element) return undefined;
    const { track } = useInspectStore.getState();
    const sizeOf = (rect: DOMRect) => ({ width: Math.round(rect.width), height: Math.round(rect.height) });
    const move = (event: PointerEvent): void => {
      const rect = element.getBoundingClientRect();
      track(inside(rect, event) ? { x: Math.round(event.clientX - rect.left), y: Math.round(event.clientY - rect.top) } : null, sizeOf(rect));
    };
    const observer = new ResizeObserver(() => track(useInspectStore.getState().pointer, sizeOf(element.getBoundingClientRect())));
    observer.observe(element);
    window.addEventListener('pointermove', move);
    return () => {
      observer.disconnect();
      window.removeEventListener('pointermove', move);
    };
  }, [box]);
};

export { useInspectTracking };
