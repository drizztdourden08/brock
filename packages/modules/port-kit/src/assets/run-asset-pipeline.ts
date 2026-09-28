/* @layer core @kind logic */
import type { AssetChunk, AssetPipelineRequest } from './asset-pipeline.type';
import { packAssetChunks } from './pack-asset-chunks';

const runAssetPipeline = async ({ rom, extractors, pack, onProgress }: AssetPipelineRequest): Promise<Uint8Array> => {
  const chunks: AssetChunk[] = [];
  const seen = new Set<string>();
  for (const [index, extractor] of extractors.entries()) {
    for (const chunk of await extractor.extract(rom)) {
      if (seen.has(chunk.name)) throw new Error(`Asset chunk "${chunk.name}" from "${extractor.id}" was already written.`);
      seen.add(chunk.name);
      chunks.push(chunk);
    }
    onProgress?.(index + 1, extractors.length, extractor.id);
  }
  return pack ? pack(chunks, rom) : packAssetChunks(chunks);
};

export { runAssetPipeline };
