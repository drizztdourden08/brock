/* @layer core @kind types */
import type {
  ControllerAddedInfo, ControllerStateListener, DeviceEntry, HidListedDevice, InputStatus, VibrateResult,
  VibrateSegment,
} from './device.type';
import type {
  ControllerJoystickSample, ControllerRawReport, JoystickInfo, RawCaptureStartResult,
} from './capture.type';
import type {
  DeviceStickCalibration, StickCalibrationStore, TriggerCalibration, TriggerCalibrationStore,
} from './calibration.type';

type Unsubscribe = () => void;

interface InputMappingApi {
  add: (mapping: string) => Promise<boolean>;
  forGuid: (guid: string) => Promise<string | null>;
}

interface InputCalibrationApi {
  readSticks: () => Promise<StickCalibrationStore>;
  writeStick: (deviceKey: string, calibration: DeviceStickCalibration) => Promise<void>;
  readTriggers: () => Promise<TriggerCalibrationStore>;
  writeTrigger: (deviceKey: string, axisIndex: number, calibration: TriggerCalibration) => Promise<void>;
}

interface InputCaptureApi {
  startRaw: (vendorId: number, productId: number) => Promise<RawCaptureStartResult>;
  stopRaw: () => Promise<void>;
  startJoystick: (joystickId: number) => Promise<boolean>;
  stopJoystick: () => Promise<void>;
  listJoysticks: () => Promise<JoystickInfo[]>;
  releaseHold: () => Promise<boolean>;
  restoreHold: () => Promise<boolean>;
  onRaw: (listener: (report: ControllerRawReport) => void) => Unsubscribe;
  onJoystick: (listener: (sample: ControllerJoystickSample) => void) => Unsubscribe;
  onHoldChanged: (listener: (held: boolean) => void) => Unsubscribe;
}

interface InputApi {
  status: () => Promise<InputStatus>;
  list: () => Promise<DeviceEntry[]>;
  listHid: () => Promise<HidListedDevice[]>;
  rescan: () => Promise<void>;
  rumble: (deviceKey: string, low: number, high: number, durationMs: number) => Promise<boolean>;
  vibratePattern: (deviceKey: string, pattern: VibrateSegment[], gapMs: number) => Promise<VibrateResult>;
  onAdded: (listener: (info: ControllerAddedInfo) => void) => Unsubscribe;
  onRemoved: (listener: (deviceKey: string) => void) => Unsubscribe;
  onState: (listener: ControllerStateListener) => Unsubscribe;
  onDevices: (listener: (devices: DeviceEntry[]) => void) => Unsubscribe;
  mapping: InputMappingApi;
  calibration: InputCalibrationApi;
  capture: InputCaptureApi;
}

export type { InputMappingApi, InputCalibrationApi, InputCaptureApi, InputApi };
