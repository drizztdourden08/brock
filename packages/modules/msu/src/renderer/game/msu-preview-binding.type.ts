/* @layer renderer-shell @kind types */
import type { PlayOutcome } from '../../original-sound/original-sound.type';

interface MsuPreviewBinding<Target = unknown> {
  play: (target: Target, id: number, onEnded: () => void) => Promise<PlayOutcome>;
  stop: () => void;
  probeAudible: (target: Target, ids: readonly number[]) => Promise<ReadonlySet<number>>;
}

export type { MsuPreviewBinding };
