/* @layer renderer-components @kind component */
import { useCallback } from 'react';
import { Button } from '@drizztdourden08/tessera/primitives';
import { inputApi } from '../../../renderer/input-api';
import { controllerInputStore } from '../../../controller-input/controller-input-store';
import type { RumbleTestButtonProps } from '../ControllerPage.type';

const RumbleTestButton = ({ deviceKey, test, disabled }: RumbleTestButtonProps) => {
  const run = useCallback(() => {
    const result = 'play' in test
      ? test.play(deviceKey)
      : inputApi().vibratePattern(deviceKey, test.steps, test.gapMs);
    result
      .then((outcome) => { if (!outcome.ok) controllerInputStore.addDiag(`Vibrate failed (${deviceKey}): ${outcome.error}`); })
      .catch((error: unknown) => controllerInputStore.addDiag(`Vibrate IPC error: ${String(error)}`));
  }, [deviceKey, test]);

  return (
    <Button variant="tertiary" size="sm" onClick={run} disabled={disabled}>
      {test.label}
    </Button>
  );
};

export { RumbleTestButton };
