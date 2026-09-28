/* @layer electron-main @kind logic */
import type { VelopackAsset } from 'velopack';

const assetListOf = (raw: unknown): unknown => {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === 'object' && 'Assets' in raw) return raw.Assets;
  return null;
};

const isAsset = (entry: unknown): entry is VelopackAsset => {
  if (!entry || typeof entry !== 'object') return false;
  const asset = entry as Partial<VelopackAsset>;
  return typeof asset.Version === 'string' && typeof asset.FileName === 'string';
};

const parseFeed = (raw: unknown): VelopackAsset[] => {
  const list = assetListOf(raw);
  return Array.isArray(list) ? list.filter(isAsset) : [];
};

export { parseFeed };
