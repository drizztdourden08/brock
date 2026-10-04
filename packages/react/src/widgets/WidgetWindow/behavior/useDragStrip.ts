/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { APP_REGION_ATTRIBUTE } from '@drizztdourden08/tessera/primitives';
import { DRAG_STRIP_SELECTOR } from '../WidgetWindow.constants';

const useDragStrip = (root: HTMLElement | null): void => {
  useEffect(() => {
    const strip = root?.querySelector<HTMLElement>(DRAG_STRIP_SELECTOR);
    if (strip && strip.getAttribute(APP_REGION_ATTRIBUTE) !== 'drag') strip.setAttribute(APP_REGION_ATTRIBUTE, 'drag');
  });
};

export { useDragStrip };
