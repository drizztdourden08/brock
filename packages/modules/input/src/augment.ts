/* @layer core @kind types */
import type {
  ControllerAddedInfo, DeviceEntry, HidListedDevice, InputStatus, VibrateResult, VibrateSegment,
} from './device.type';
import type {
  ControllerJoystickSample, ControllerRawReport, JoystickInfo, RawCaptureStartResult,
} from './capture.type';
import type {
  DeviceStickCalibration, StickCalibrationStore, TriggerCalibration, TriggerCalibrationStore,
} from './calibration.type';
import type { InputApi } from './input-api.type';

declare module '@drizztdourden08/brock-core/augment' {
  interface InvokeContract {
    'input:status': () => Promise<InputStatus>;
    'input:list': () => Promise<DeviceEntry[]>;
    'input:listHid': () => Promise<HidListedDevice[]>;
    'input:rescan': () => Promise<void>;
    'input:rumble': (deviceKey: string, low: number, high: number, durationMs: number) => Promise<boolean>;
    'input:vibratePattern': (deviceKey: string, pattern: VibrateSegment[], gapMs: number) => Promise<VibrateResult>;
    'input:mapping:add': (mapping: string) => Promise<boolean>;
    'input:mapping:forGuid': (guid: string) => Promise<string | null>;
    'input:calibration:readSticks': () => Promise<StickCalibrationStore>;
    'input:calibration:writeStick': (deviceKey: string, calibration: DeviceStickCalibration) => Promise<void>;
    'input:calibration:readTriggers': () => Promise<TriggerCalibrationStore>;
    'input:calibration:writeTrigger': (deviceKey: string, axisIndex: number, calibration: TriggerCalibration) => Promise<void>;
    'input:capture:startRaw': (vendorId: number, productId: number) => Promise<RawCaptureStartResult>;
    'input:capture:stopRaw': () => Promise<void>;
    'input:capture:startJoystick': (joystickId: number) => Promise<boolean>;
    'input:capture:stopJoystick': () => Promise<void>;
    'input:capture:listJoysticks': () => Promise<JoystickInfo[]>;
    'input:capture:releaseHold': () => Promise<boolean>;
    'input:capture:restoreHold': () => Promise<boolean>;
  }

  interface EventContract {
    'input:added': (info: ControllerAddedInfo) => void;
    'input:removed': (deviceKey: string) => void;
    'input:state': (deviceKey: string, buttons: boolean[], axes: number[]) => void;
    'input:devices': (devices: DeviceEntry[]) => void;
    'input:raw': (report: ControllerRawReport) => void;
    'input:joystick': (sample: ControllerJoystickSample) => void;
    'input:holdChanged': (held: boolean) => void;
  }

  interface IpcNamespaces {
    input: InputApi;
  }
}
