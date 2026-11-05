/* @layer renderer-shell @kind types */
import type { MsuEffectsPanelProps } from './msu.type';

interface MsuSoundPanelProps extends Omit<MsuEffectsPanelProps, 'channels'> {
  channel: string;
}

export type { MsuSoundPanelProps };
