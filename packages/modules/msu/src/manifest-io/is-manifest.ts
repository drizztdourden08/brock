/* @layer core @kind logic */
import type { MsuPackManifest } from '../types';

const isManifest = (value: unknown): value is MsuPackManifest => {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return record.version === 1 && Boolean(record.meta) && Array.isArray(record.tracks);
};

export { isManifest };
