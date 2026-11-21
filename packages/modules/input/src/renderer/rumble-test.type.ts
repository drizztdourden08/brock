/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { VibrateResult, VibrateSegment } from '../device.type';

type RumbleTest =
  | { label: Text; steps: VibrateSegment[]; gapMs: number }
  | { label: Text; play: (deviceKey: string) => Promise<VibrateResult> };

export type { RumbleTest };
