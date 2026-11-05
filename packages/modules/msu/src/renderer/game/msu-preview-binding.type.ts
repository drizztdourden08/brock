/* @layer renderer-shell @kind types */
interface MsuPreviewBinding<Target = unknown> {
  play: (target: Target, id: number, onEnded: () => void) => Promise<void> | void;
  stop: () => void;
  probeAudible: (target: Target, ids: readonly number[]) => Promise<ReadonlySet<number>>;
}

export type { MsuPreviewBinding };
