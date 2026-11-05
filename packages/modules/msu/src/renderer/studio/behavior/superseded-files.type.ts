/* @layer renderer-shell @kind types */
import type { MsuPackManifest } from '../../../types';
import type { MsuFile } from '../msu.type';

interface SupersededParams {
  pack: string;
  files: MsuFile[];
  saveBase: MsuPackManifest | null;
  reload: () => void;
}

export type { SupersededParams };
