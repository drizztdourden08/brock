/* @layer renderer-components @kind logic */
import { DRAG_DEVICE_NAME, DRAG_PID, DRAG_SDL_TYPE, DRAG_VID } from '../ControlsSettings.constants';
import type { ReadDroppedPresetParams } from './controls-behavior.type';
import type { PresetDevice } from '../ControlsSettings.type';

const readDroppedPreset = ({ transfer }: ReadDroppedPresetParams): PresetDevice | null => {
  const sdlType = transfer.getData(DRAG_SDL_TYPE);
  if (!sdlType) return null;

  return {
    sdlType,
    deviceName: transfer.getData(DRAG_DEVICE_NAME),
    vid: transfer.getData(DRAG_VID),
    pid: transfer.getData(DRAG_PID),
  };
};

export { readDroppedPreset };
