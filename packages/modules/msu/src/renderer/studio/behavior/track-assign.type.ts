/* @layer renderer-shell @kind types */
import type { MsuPackManifest } from '../../../types';
import type { MsuFile, PackFormat } from '../msu.type';

interface TrackAssignParams {
  pack: string | null;
  format: PackFormat;
  manifest: MsuPackManifest;
  files: MsuFile[];
  reload: () => void;
}

export type { TrackAssignParams };
