/* @layer core @kind types */
interface ZipEntry {
  name: string;
  bytes: Uint8Array;
  store?: boolean;
}

export type { ZipEntry };
