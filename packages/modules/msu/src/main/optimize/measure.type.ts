/* @layer electron-main @kind types */
import type { EncoderTools } from '../encoder/encoder-tools.type';
import type { PackEnv } from '../pack-fs';

interface MeasureRequest {
  env: PackEnv & EncoderTools;
  pack: string;
  tempDir: string;
  fileName: string;
  filePath: string;
  sizeBytes: number;
  index: number;
}

export type { MeasureRequest };
