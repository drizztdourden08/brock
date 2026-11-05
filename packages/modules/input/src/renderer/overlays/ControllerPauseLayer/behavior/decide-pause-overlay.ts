/* @layer renderer-shell @kind logic */
import { MANUAL_PAUSE_NAME, RUNNING_STATUS } from '../ControllerPauseLayer.constants';
import type { PauseOverlayKind } from '../ControllerPauseLayer.type';

const decidePauseOverlay = (
  status: string,
  controllerPaused: boolean,
  disconnectedName: string,
  manualPauseName: string = MANUAL_PAUSE_NAME,
): PauseOverlayKind => {
  if (!controllerPaused || status !== RUNNING_STATUS) return 'none';
  const manual = !disconnectedName || disconnectedName === manualPauseName;
  return manual ? 'manual' : 'disconnect';
};

export { decidePauseOverlay };
