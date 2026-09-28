/* @layer core @kind types */
type ControllerBusType = 'usb' | 'bluetooth' | 'unknown';

type ControllerConnectionState = 'wired' | 'wireless' | 'unknown';

type ControllerGamepadType =
  | 'unknown'
  | 'standard'
  | 'xbox360'
  | 'xboxone'
  | 'ps3'
  | 'ps4'
  | 'ps5'
  | 'switch-pro'
  | 'joycon-left'
  | 'joycon-right'
  | 'joycon-pair'
  | 'gamecube';

type DeviceStatus = 'ready' | 'unavailable';

interface ControllerAddedInfo {
  deviceKey: string;
  sdlId: number;
  name: string;
  vendorId: number;
  productId: number;
  guid: string;
  hasRumble: boolean;
  hasGyro: boolean;
  busType: ControllerBusType;
  connectionState: ControllerConnectionState;
  sdlType: ControllerGamepadType;
  hasButton: boolean[];
  hasAxis: boolean[];
  buttonLabels: string[];
}

interface HidListedDevice {
  vendorId: number;
  productId: number;
  product: string;
  busType: ControllerBusType;
}

interface DeviceEntry {
  deviceKey: string;
  vendorId: number;
  productId: number;
  name?: string;
  mapping?: string;
  product: string;
  busType: ControllerBusType;
  status: DeviceStatus;
  sdlId?: number;
  guid?: string;
  hasRumble?: boolean;
  hasGyro?: boolean;
  connectionState?: ControllerConnectionState;
  sdlType?: ControllerGamepadType;
  hasButton?: boolean[];
  hasAxis?: boolean[];
  buttonLabels?: string[];
}

interface InputStatus {
  available: boolean;
  sdlVersion: string | null;
}

interface VibrateSegment {
  durationMs: number;
  intensity: number;
}

interface VibrateResult {
  ok: boolean;
  error?: string;
}

type ControllerStateListener = (deviceKey: string, buttons: boolean[], axes: number[]) => void;

export type {
  ControllerBusType, ControllerConnectionState, ControllerGamepadType, DeviceStatus, ControllerAddedInfo,
  HidListedDevice, DeviceEntry, InputStatus, VibrateSegment, VibrateResult, ControllerStateListener,
};
