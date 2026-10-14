/* @layer core @kind types */
interface ZipEntryInfo {
  name: string;
  method: number;
  encrypted: boolean;
  compressedSize: number;
  size: number;
  localOffset: number;
}

interface ZipEntry {
  name: string;
  size: number;
  read: () => Promise<Uint8Array>;
}

export type { ZipEntryInfo, ZipEntry };
