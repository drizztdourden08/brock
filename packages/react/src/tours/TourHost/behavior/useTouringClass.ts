/* @layer renderer-shell @kind hook */
import { useLayoutEffect } from 'react';
import { TOURING_CLASS } from '../../tours.constants';

const useTouringClass = (open: boolean): void => {
  useLayoutEffect(() => {
    if (!open) return undefined;
    const root = document.documentElement;
    root.classList.add(TOURING_CLASS);
    return () => root.classList.remove(TOURING_CLASS);
  }, [open]);
};

export { useTouringClass };
