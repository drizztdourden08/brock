/* @layer renderer-shell @kind logic */
import type { ControllerGamepadType } from '../../device.type';
import { sdlTypesByVidPid } from './sdl-types-by-vid-pid';

const recallControllerSdlType = (vendorId: number, productId: number): ControllerGamepadType | null =>
  sdlTypesByVidPid.map.get(sdlTypesByVidPid.keyOf(vendorId, productId)) ?? null;

export { recallControllerSdlType };
