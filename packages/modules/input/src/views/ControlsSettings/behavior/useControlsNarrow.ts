/* @layer renderer-components @kind hook */
import { useLayoutEffect, useState } from 'react';
import { CONTROLS_ROOT_SELECTOR, NARROW_WIDTH_PX } from '../ControlsSettings.constants';

const useControlsNarrow = (): boolean => {
  const [narrow, setNarrow] = useState(false);
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>(CONTROLS_ROOT_SELECTOR);
    if (!root) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setNarrow(entry.contentRect.width < NARROW_WIDTH_PX);
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);
  return narrow;
};

export { useControlsNarrow };
