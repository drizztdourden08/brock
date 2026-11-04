/* @layer core @kind logic */
import type { MsuPackManifest } from '../../../types';

const serializeForExport = (manifest: MsuPackManifest): Uint8Array =>
  new TextEncoder().encode(`${JSON.stringify(manifest, null, 2)}\n`);

export { serializeForExport };
