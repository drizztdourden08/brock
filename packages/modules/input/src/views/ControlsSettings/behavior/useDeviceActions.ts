/* @layer renderer-components @kind hook */
import { useCallback } from 'react';
import type { DragEvent } from 'react';
import type { DeviceAssignInfo, DeviceListEntry } from '../sub-components/DeviceRow.type';
import { setDeviceDragData } from './set-device-drag-data';

const useDeviceActions = (entry: DeviceListEntry, onAssign: (device: DeviceAssignInfo) => void) => {
  const { drag, ready } = entry;

  const handleDragStart = useCallback((e: DragEvent) => {
    if (!ready) {
      e.preventDefault();
      return;
    }
    setDeviceDragData(e, drag);
  }, [ready, drag]);

  const handleAssign = useCallback(() => {
    if (!ready) return;
    const { sdlType, displayName, vendorId, productId } = drag;
    onAssign({ sdlType, displayName, vendorId, productId });
  }, [ready, drag, onAssign]);

  return { handleDragStart, handleAssign };
};

export { useDeviceActions };
