/* @layer core @kind types */
interface RomIdentity {
  id: string;
  label: string;
}

interface RomDefinition {
  extensions: string[];
  known: Record<string, RomIdentity>;
  normalize?: (bytes: Uint8Array) => Uint8Array;
}

interface RomImage {
  bytes: Uint8Array;
  hash: string;
  identity: RomIdentity;
}

type RomCheck =
  | { ok: true; rom: RomImage }
  | { ok: false; hash: string; reason: 'unknown' | 'extension' };

interface StoredRom {
  file: string;
  identity: RomIdentity;
  hasAssets: boolean;
}

export type { RomIdentity, RomDefinition, RomImage, RomCheck, StoredRom };
