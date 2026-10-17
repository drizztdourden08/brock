/* @layer renderer-shell @kind hook */
import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';
import type { WalkerRect } from '../WindowMascot.type';

const sameRect = (a: WalkerRect | null, b: WalkerRect): boolean =>
  a !== null && a.left === b.left && a.top === b.top && a.width === b.width && a.height === b.height;

const useProbeRect = (ref: RefObject<HTMLElement | null>): WalkerRect | null => {
  const [rect, setRect] = useState<WalkerRect | null>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const measure = (): void => {
      const { left, top, width, height } = node.getBoundingClientRect();
      const next = { left, top, width, height };
      setRect((before) => (sameRect(before, next) ? before : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    window.addEventListener('resize', measure);
    document.addEventListener('animationend', measure, true);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
      document.removeEventListener('animationend', measure, true);
    };
  }, [ref]);

  return rect;
};

export { useProbeRect };
