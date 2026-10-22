/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { PadState } from '../pad/controller-slot.type';
import { padStateOf } from '../pad/pad-state-of';
import { useControllerState } from './useControllerState';

const usePadState = (deviceKey: string): PadState => {
  const { buttons, axes } = useControllerState(deviceKey);
  return useMemo(() => padStateOf(buttons, axes), [buttons, axes]);
};

export { usePadState };
