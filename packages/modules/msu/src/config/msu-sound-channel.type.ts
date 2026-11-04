/* @layer core @kind types */
interface MsuSoundChannel {
  name: string;
  kind: 'stateful' | 'additive';
  bus: 'ambient' | 'sfx';
  coreIndex: number;
  previewSeconds: number;
  silenceAtTitle?: boolean;
}

export type { MsuSoundChannel };
