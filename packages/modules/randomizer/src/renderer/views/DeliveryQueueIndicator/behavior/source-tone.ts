/* @layer renderer-shell @kind logic */
import type { StatusTone } from '@drizztdourden08/tessera/primitives';
import { SOURCE_TONES, UNKNOWN_SOURCE_TONE } from '../DeliveryQueueIndicator.constants';

const sourceTone = (source: string): StatusTone => {
  const lower = source.toLowerCase();
  return SOURCE_TONES.find(([prefix]) => lower.startsWith(prefix))?.[1] ?? UNKNOWN_SOURCE_TONE;
};

export { sourceTone };
