/* @layer core @kind types */
import type { InputBinding } from '../bindings.type';

interface RawInputEvent {
  binding: InputBinding;
  sourceDeviceKey: string;
  vendorId: string | null;
  productId: string | null;
}

type RawInputListener = (event: RawInputEvent) => void;

type AxisDirection = '+' | '-' | null;

interface PadStateSnapshot {
  buttons: boolean[];
  axes: number[];
}

export type { AxisDirection, PadStateSnapshot, RawInputEvent, RawInputListener };
