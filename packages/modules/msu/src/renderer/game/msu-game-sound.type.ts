/* @layer renderer-shell @kind types */
interface MsuGameSound {
  id: number;
  label: string | null;
  triggers: readonly string[];
  sites: number;
}

interface MsuSoundSource {
  list: (channel: string) => readonly MsuGameSound[];
  name: (channel: string, id: number) => string | null;
  roleOf?: (channel: string, id: number) => string | null;
  isReachable?: (channel: string, id: number) => boolean;
}

export type { MsuGameSound, MsuSoundSource };
