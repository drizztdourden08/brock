/* @layer renderer-components @kind types */
interface DeviceDragInfo {
  id: string;
  displayName: string;
  sdlType: string | null;
  vendorId: string | null;
  productId: string | null;
}

interface DeviceAssignInfo {
  sdlType: string | null;
  displayName: string;
  vendorId: string | null;
  productId: string | null;
}

interface DeviceListEntry {
  key: string;
  drag: DeviceDragInfo;
  family: string;
  iconSrc: string | null;
  meta: string;
  ready: boolean;
  unavailable: boolean;
}

interface DeviceRowProps {
  entry: DeviceListEntry;
  onAssign: (device: DeviceAssignInfo) => void;
  onAddMapping: (mapping: string) => Promise<boolean>;
}

export type { DeviceAssignInfo, DeviceDragInfo, DeviceListEntry, DeviceRowProps };
