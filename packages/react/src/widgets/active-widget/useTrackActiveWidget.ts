/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { trackActiveWidget } from './track-active-widget';

const useTrackActiveWidget = (windowWidget: string | null = null): void => {
  useEffect(() => trackActiveWidget(document, windowWidget), [windowWidget]);
};

export { useTrackActiveWidget };
