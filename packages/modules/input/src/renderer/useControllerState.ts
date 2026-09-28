/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { ControllerLiveState } from './controller-state-store.type';
import { IDLE_CONTROLLER_STATE } from './input-renderer.constants';
import { useControllerStateStore } from './useControllerStateStore';

const useControllerState = (deviceKey: string): ControllerLiveState => {
  const listen = useControllerStateStore((s) => s.listen);
  useEffect(() => { listen(); }, [listen]);
  return useControllerStateStore((s) => s.states[deviceKey] ?? IDLE_CONTROLLER_STATE);
};

export { useControllerState };
