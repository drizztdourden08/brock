/* @layer renderer-shell @kind types */
import type { MsuPackManifest } from '../../../types';
import type { MsuFile } from '../msu.type';

interface SoundPanelParams {
  pack: string;
  channel: string;
  filter: string;
  showUnreachable: boolean;
  manifest: MsuPackManifest;
  saveBase: MsuPackManifest;
  files: MsuFile[];
  reload: () => void;
}

export type { SoundPanelParams };
