/* @layer core @kind types */
import type { MsuPackManifest } from '../../../types';
import type { LoadBytes } from '../dedupe-files';

interface MsulExportProgress {
  fileName: string;
  done: number;
  total: number;
}

interface ExportMsulParams {
  manifest: MsuPackManifest;
  fileNames: string[];
  loadBytes: LoadBytes;
  onProgress?: (progress: MsulExportProgress) => void;
}

export type { ExportMsulParams };
