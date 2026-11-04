/* @layer core @kind logic */
import type { MsuPackManifest } from '../types';

const withPackName = (manifest: MsuPackManifest, pack: string): MsuPackManifest =>
  ({ ...manifest, meta: { ...manifest.meta, name: pack } });

export { withPackName };
