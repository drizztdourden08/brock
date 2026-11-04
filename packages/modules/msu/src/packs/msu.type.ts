/* @layer core @kind types */
interface MsuFileMetadata {
  name: string;
  size: number;
  ext: string;
  durationSeconds: number | null;
  sampleRate: number | null;
  channels: number | null;
  bitRate: number | null;
}

interface MsuPackSummary {
  name: string;
  fileCount: number;
  totalSize: number;
  notForThisGame: string | null;
}

interface MsuPackFile {
  name: string;
  size: number;
}

interface MsuTrackFile {
  fileName: string;
  trackNum: number;
  ext: string;
}

export type { MsuFileMetadata, MsuPackFile, MsuPackSummary, MsuTrackFile };
