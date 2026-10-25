/* @layer renderer-shell @kind types */
import type { PadFamily } from '../pad/controller-slot.type';

type LayoutFamily = PadFamily | 'snes';

type DevicePositions = ReadonlySet<string>;

export type { DevicePositions, LayoutFamily };
