/* @layer renderer-shell @kind types */
import type { VibrateResult, VibrateSegment } from '../device.type';

type RumbleTest =
  | { label: string; steps: VibrateSegment[]; gapMs: number }
  | { label: string; play: (deviceKey: string) => Promise<VibrateResult> };

export type { RumbleTest };
