/* @layer core @kind types */
interface AssignedKey {
  deviceKey: string;
  vidPid: string;
  slot: number;
}

interface DeviceKeys {
  assign: (sdlId: number, vendorId: number, productId: number) => string;
  release: (sdlId: number) => string | undefined;
  keyFor: (sdlId: number) => string | undefined;
}

export type { AssignedKey, DeviceKeys };
