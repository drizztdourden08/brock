/* @layer electron-main @kind types */
import type { ControllerConnectionState, ControllerGamepadType } from '../device.type';
import type { JoystickInfo, RawCaptureFailureReason } from '../capture.type';

interface Sdl3AddedEvent {
  type: 'added';
  id: number;
  name: string;
  vendorId: number;
  productId: number;
  guid: string;
  hasRumble: boolean;
  hasGyro: boolean;
  connectionState: ControllerConnectionState;
  sdlType: ControllerGamepadType;
  hasButton: boolean[];
  hasAxis: boolean[];
  buttonLabels: string[];
}

interface Sdl3RemovedEvent {
  type: 'removed';
  id: number;
}

interface Sdl3StateEvent {
  type: 'state';
  id: number;
  buttons: boolean[];
  axes: number[];
}

interface Sdl3ErrorEvent {
  type: 'error';
  message: string;
}

interface Sdl3RawEvent {
  type: 'raw';
  vendorId: number;
  productId: number;
  reportId: number;
  bytes: number[];
}

interface Sdl3JoystickEvent {
  type: 'joystick';
  id: number;
  buttons: boolean[];
  axes: number[];
  hats: number[];
}

interface Sdl3GamepadHoldEvent {
  type: 'gamepad-hold';
  held: boolean;
}

type Sdl3Event =
  | Sdl3AddedEvent
  | Sdl3RemovedEvent
  | Sdl3StateEvent
  | Sdl3ErrorEvent
  | Sdl3RawEvent
  | Sdl3JoystickEvent
  | Sdl3GamepadHoldEvent;

type Sdl3EventCallback = (event: Sdl3Event) => void;

interface Sdl3HidDevice {
  vendorId: number;
  productId: number;
  productString: string;
  manufacturerString: string;
  path: string;
  busType: 'usb' | 'bluetooth' | 'unknown';
}

type Sdl3RawCaptureResult = { success: true } | { success: false; reason: RawCaptureFailureReason; message?: string };

interface Sdl3Input {
  start: (callback: Sdl3EventCallback) => void;
  stop: () => void;
  rumble: (id: number, low: number, high: number, durationMs: number) => boolean;
  addMapping: (mapping: string) => boolean;
  addMappingsFromFile: (path: string) => number;
  enumerateHid: () => Sdl3HidDevice[];
  rescan: () => void;
  releaseGamepads: () => boolean;
  restoreGamepads: () => boolean;
  version: () => string | null;
  startRawCapture: (vendorId: number, productId: number) => Sdl3RawCaptureResult;
  stopRawCapture: () => void;
  startJoystickCapture: (joystickId: number) => boolean;
  stopJoystickCapture: () => void;
  listJoysticks: () => JoystickInfo[];
  mappingForGuid: (guid: string) => string | null;
}

export type { Sdl3AddedEvent, Sdl3Event, Sdl3EventCallback, Sdl3HidDevice, Sdl3RawCaptureResult, Sdl3Input };
