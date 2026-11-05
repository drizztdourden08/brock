/* @layer renderer-components @kind logic */
import type { DragEvent } from 'react';
import { DRAG_DEVICE_NAME, DRAG_PID, DRAG_SDL_TYPE, DRAG_VID } from '../ControlsSettings.constants';
import type { DeviceDragInfo } from '../sub-components/DeviceRow.type';

const setDeviceDragData = (e: DragEvent, info: DeviceDragInfo): void => {
  e.dataTransfer.setData(DRAG_DEVICE_NAME, info.displayName);
  e.dataTransfer.setData(DRAG_SDL_TYPE, info.sdlType ?? '');
  e.dataTransfer.setData(DRAG_VID, info.vendorId ?? '');
  e.dataTransfer.setData(DRAG_PID, info.productId ?? '');
  e.dataTransfer.effectAllowed = 'copy';
};

export { setDeviceDragData };
