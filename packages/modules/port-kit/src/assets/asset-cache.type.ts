/* @layer core @kind types */
import type { AssetProgress } from './asset-pipeline.type';

interface AssetCache {
  load: (romFile: string, onProgress?: AssetProgress) => Promise<Uint8Array>;
  rebuild: (romFile: string, onProgress?: AssetProgress) => Promise<Uint8Array>;
}

export type { AssetCache };
