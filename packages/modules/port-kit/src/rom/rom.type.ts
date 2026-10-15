/* @layer core @kind types */
import type { FileStore } from '@drizztdourden08/brock-core/platform';

interface RomIdentity {
  id: string;
  label: string;
}

type RomDerived = (file: string, files: FileStore) => string[] | Promise<string[]>;

interface RomRules {
  extensions: string[];
  known: Record<string, RomIdentity>;
  normalize?: (bytes: Uint8Array) => Uint8Array;
  keepFileName?: boolean;
  acceptUnknown?: boolean;
  maxBytes?: number;
  derived?: RomDerived;
}

interface RomKindDefinition extends RomRules {
  label?: string;
  dir?: string;
}

interface RomDefinition extends RomRules {
  kinds?: Record<string, RomKindDefinition>;
}

interface RomImage {
  bytes: Uint8Array;
  hash: string;
  identity: RomIdentity;
  unknown?: boolean;
}

type RomRefusal = 'unknown' | 'extension' | 'size' | 'archive';

type RomCheck =
  | { ok: true; rom: RomImage }
  | { ok: false; hash: string; reason: RomRefusal };

interface StoredRom {
  file: string;
  identity: RomIdentity;
  hasAssets: boolean;
  unknown?: boolean;
  hash?: string;
}

interface RomFileName {
  file: string;
  label: string;
  hasAssets: boolean;
  assetBytes: number | null;
}

export type {
  RomFileName, RomIdentity, RomDerived, RomRules, RomKindDefinition, RomDefinition, RomImage, RomRefusal, RomCheck, StoredRom,
};
