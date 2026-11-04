/* @layer core @kind types */
interface DataPackageCache {
  read(game: string, checksum: string): unknown | null;
  write(game: string, checksum: string, pkg: unknown): void;
}

export type { DataPackageCache };
