/* @layer renderer-components @kind hook */
import { useEffect, useState } from 'react';
import { controllerInputStore } from '../../../controller-input/controller-input-store';
import type { ControllerInputState } from '../../../runtime/controller-input-store.type';
import { IDLE_AXIS_SLOTS, IDLE_BUTTON_SLOTS } from '../ControllerPage.constants';

const idleStateOf = (deviceKey: string): ControllerInputState => ({
  deviceKey,
  buttons: new Array<boolean>(IDLE_BUTTON_SLOTS).fill(false),
  axes: new Array<number>(IDLE_AXIS_SLOTS).fill(0),
  timestamp: 0,
});

const useControllerInputState = (deviceKey: string): ControllerInputState => {
  const [state, setState] = useState<ControllerInputState>(
    () => controllerInputStore.getStates().get(deviceKey) ?? idleStateOf(deviceKey),
  );

  useEffect(() => {
    const stopInput = controllerInputStore.onInput((incoming) => {
      if (incoming.deviceKey === deviceKey) setState(incoming);
    });
    const stopRemoved = controllerInputStore.onDisconnect((removed) => {
      if (removed === deviceKey) setState(idleStateOf(deviceKey));
    });
    return () => { stopInput(); stopRemoved(); };
  }, [deviceKey]);

  return state;
};

export { useControllerInputState };
