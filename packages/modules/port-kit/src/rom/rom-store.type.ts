/* @layer core @kind types */
import type { RomCheck, RomRefusal, RomRules, StoredRom } from './rom.type';

type RomImport = RomCheck & { file?: string; existed?: boolean };

type RomCandidate = { ok: true; name: string; bytes: Uint8Array } | { ok: false; reason: RomRefusal };

interface RomKindStore {
  kind: string;
  importRom: (fileName: string, bytes: Uint8Array) => Promise<RomImport>;
  list: () => Promise<StoredRom[]>;
  read: (file: string) => Promise<RomCheck | null>;
  remove: (file: string) => Promise<string[]>;
  assetFileOf: (file: string) => string | null;
}

interface RomStore extends RomKindStore {
  kinds: () => string[];
  of: (kind: string) => RomKindStore;
}

interface RomKindSetup {
  kind: string;
  rules: RomRules;
  dir: string;
  assetExtension: string | null;
}

export type { RomImport, RomCandidate, RomKindStore, RomStore, RomKindSetup };
