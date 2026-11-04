/* @layer core @kind logic */
import type { MsuPackManifest } from '../types';

const serializeManifest = (manifest: MsuPackManifest): string => {
  const stamped: MsuPackManifest = { ...manifest, meta: { ...manifest.meta, modifiedAt: Date.now() } };
  return `${JSON.stringify(stamped, null, 2)}\n`;
};

export { serializeManifest };
