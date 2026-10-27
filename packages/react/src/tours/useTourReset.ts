/* @layer renderer-shell @kind hook */
import { useContext, useEffect, useRef } from 'react';
import { screenReset } from '../screens/screen-reset';
import { ScreenStateScope } from '../screens/screen-state-scope';
import type { TourResetHandler } from './tour.type';

const useTourReset = (handler: TourResetHandler): void => {
  const scope = useContext(ScreenStateScope);
  const latest = useRef(handler);
  latest.current = handler;
  useEffect(() => screenReset.onReset(scope, (parts) => latest.current(parts)), [scope]);
};

export { useTourReset };
