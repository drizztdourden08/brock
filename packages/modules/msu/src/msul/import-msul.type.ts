/* @layer core @kind types */
import type { MsuPackManifest } from '../types';
import type { ArchiveEntry } from '../archive';

interface MsulPack {
  manifest: MsuPackManifest;
  files: ArchiveEntry[];
}

export type { MsulPack };
