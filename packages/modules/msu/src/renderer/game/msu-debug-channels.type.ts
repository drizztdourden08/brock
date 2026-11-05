/* @layer renderer-shell @kind types */
interface MsuDebugChannels {
  channels: readonly string[];
  titles: Record<string, string>;
  layerSlots: Record<string, number>;
}

export type { MsuDebugChannels };
