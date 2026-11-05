/* @layer renderer-shell @kind component */
import { decidePauseOverlay, useControllerPause } from './behavior';
import { ControllerDisconnectOverlay } from './sub-components/ControllerDisconnectOverlay';
import { ManualPauseOverlay } from './sub-components/ManualPauseOverlay';
import type { ControllerPauseLayerProps } from './ControllerPauseLayer.type';

const ControllerPauseLayer = (props: ControllerPauseLayerProps) => {
  const { status, source, manualPauseName, presenceDelayMs, ...overlay } = props;
  const { controllerPaused, disconnectedName } = useControllerPause(status, source, presenceDelayMs);
  const kind = decidePauseOverlay(status, controllerPaused, disconnectedName, manualPauseName);

  if (kind === 'none') return null;
  if (kind === 'manual') return <ManualPauseOverlay />;
  return <ControllerDisconnectOverlay controllerName={disconnectedName} {...overlay} />;
};

export { ControllerPauseLayer };
