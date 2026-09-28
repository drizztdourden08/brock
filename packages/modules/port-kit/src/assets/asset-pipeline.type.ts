/* @layer core @kind types */
import type { RomImage } from '../rom/rom.type';

interface AssetChunk {
  name: string;
  data: Uint8Array;
}

interface AssetExtractor {
  id: string;
  extract: (rom: RomImage) => AssetChunk[] | Promise<AssetChunk[]>;
}

type AssetPacker = (chunks: AssetChunk[], rom: RomImage) => Uint8Array;

type AssetProgress = (done: number, total: number, extractorId: string) => void;

interface AssetPipelineRequest {
  rom: RomImage;
  extractors: AssetExtractor[];
  pack?: AssetPacker;
  onProgress?: AssetProgress;
}

export type { AssetChunk, AssetExtractor, AssetPacker, AssetProgress, AssetPipelineRequest };
