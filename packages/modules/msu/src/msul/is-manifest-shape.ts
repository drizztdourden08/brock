/* @layer core @kind logic */
import type { MsuPackManifest } from '../types';

const isManifestShape = (value: unknown): value is MsuPackManifest => {
  if (typeof value !== 'object' || value === null) return false;
  const manifest = value as MsuPackManifest;
  return Boolean(manifest.meta) && typeof manifest.meta.name === 'string' && Array.isArray(manifest.tracks);
};

export { isManifestShape };
