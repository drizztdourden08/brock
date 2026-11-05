/* @layer renderer-shell @kind types */
import type { SoundListItemProps, SoundPanelController } from './msu.type';

type SoundPanelRowsProps = Pick<SoundListItemProps, 'onSelect' | 'onPreview' | 'onPlayOriginal'> & {
  channel: string;
  sound: SoundPanelController;
  filter: string;
};

export type { SoundPanelRowsProps };
