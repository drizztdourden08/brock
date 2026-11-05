/* @layer renderer-shell @kind types */
interface MsuGameSound {
  id: number;
  label: string;
  triggers: readonly string[];
  sites: readonly string[];
}

interface MsuSoundSource {
  list: (channel: string) => readonly MsuGameSound[];
  name: (channel: string, id: number) => string;
  roleOf?: (channel: string, id: number) => string | null;
  isReachable?: (channel: string, id: number) => boolean;
}

export type { MsuGameSound, MsuSoundSource };
