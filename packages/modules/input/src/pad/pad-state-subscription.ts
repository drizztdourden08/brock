/* @layer core @kind logic */
import type { ControllerStateListener } from '../device.type';
import type { PadStateListener } from './controller-slot.type';
import { padStateOf } from './pad-state-of';

// Builds onPadState from onState, so a host sends one stream and no second event crosses the bridge.
const padStateSubscription =
  (onState: (listener: ControllerStateListener) => () => void) =>
  (listener: PadStateListener): (() => void) =>
    onState((deviceKey, buttons, axes) => listener(deviceKey, padStateOf(buttons, axes)));

export { padStateSubscription };
