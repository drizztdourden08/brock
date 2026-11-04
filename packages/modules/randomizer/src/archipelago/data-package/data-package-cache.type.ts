/* @layer core @kind types */
interface DataPackageCache {
  read(game: string, checksum: string): unknown;
  write(game: string, checksum: string, pkg: unknown): void;
}

export type { DataPackageCache };
