/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import { CONTROLLER_PRESENCE_DELAY_MS, RUNNING_STATUS } from '../ControllerPauseLayer.constants';
import type { ControllerPauseSource, PauseState } from '../ControllerPauseLayer.type';

const useControllerPause = (status: string, source: ControllerPauseSource, presenceDelayMs: number = CONTROLLER_PRESENCE_DELAY_MS): PauseState => {
  const [state, setState] = useState<PauseState>({ controllerPaused: false, disconnectedName: '' });

  useEffect(() => {
    if (status !== RUNNING_STATUS) return;
    return source.onPauseChange((controllerPaused, disconnectedName) => setState({ controllerPaused, disconnectedName }));
  }, [status, source]);

  useEffect(() => {
    if (status !== RUNNING_STATUS) return;
    const id = setTimeout(() => source.checkControllerPresence(), presenceDelayMs);
    return () => clearTimeout(id);
  }, [status, source, presenceDelayMs]);

  return state;
};

export { useControllerPause };
