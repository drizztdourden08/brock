/* @layer core @kind types */
import type { ArchiveEntry } from '../../archive';

interface InstallOptions {
  desiredName?: string;
  onProgress?: (done: number, total: number) => void;
}

interface InstallResult {
  pack: string;
  ownName: string;
  fileCount: number;
  trackCount: number;
  missingFiles: string[];
}

interface PackEntries {
  entries: ArchiveEntry[];
  onProgress?: InstallOptions['onProgress'];
}

export type { InstallOptions, InstallResult, PackEntries };
