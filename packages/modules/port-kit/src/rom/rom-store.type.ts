/* @layer core @kind types */
import type { RomCheck, StoredRom } from './rom.type';

type RomImport = RomCheck & { file?: string };

interface RomStore {
  importRom: (fileName: string, bytes: Uint8Array) => Promise<RomImport>;
  list: () => Promise<StoredRom[]>;
  read: (file: string) => Promise<RomCheck | null>;
  remove: (file: string) => Promise<void>;
  assetFileOf: (file: string) => string | null;
}

export type { RomImport, RomStore };
