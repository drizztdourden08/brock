/* @layer core @kind logic */
import type { AssetChunk } from './asset-pipeline.type';
import { ASSET_PACK_MAGIC, ASSET_PACK_VERSION } from './asset-pack.constants';

const packAssetChunks = (chunks: AssetChunk[]): Uint8Array => {
  const encoder = new TextEncoder();
  const names = chunks.map((chunk) => encoder.encode(chunk.name));
  const size = chunks.reduce((sum, chunk, i) => sum + 8 + (names[i]?.length ?? 0) + chunk.data.length, 9);
  const out = new Uint8Array(size);
  const view = new DataView(out.buffer);
  out.set(ASSET_PACK_MAGIC, 0);
  out[4] = ASSET_PACK_VERSION;
  view.setUint32(5, chunks.length, true);
  let at = 9;
  chunks.forEach((chunk, i) => {
    const name = names[i] ?? new Uint8Array();
    view.setUint32(at, name.length, true);
    out.set(name, at + 4);
    at += 4 + name.length;
    view.setUint32(at, chunk.data.length, true);
    out.set(chunk.data, at + 4);
    at += 4 + chunk.data.length;
  });
  return out;
};

export { packAssetChunks };
