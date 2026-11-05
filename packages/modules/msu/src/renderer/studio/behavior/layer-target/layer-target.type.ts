/* @layer renderer-shell @kind types */
import type { MsuLayer, MsuPackManifest } from '../../../../types';

interface LayerTarget {
  previewKey: string;
  label: string;
  read: (manifest: MsuPackManifest) => MsuLayer[];
  write: (base: MsuPackManifest, layers: MsuLayer[]) => MsuPackManifest;
  oneShot: boolean;
}

export type { LayerTarget };
