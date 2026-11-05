/* @layer core @kind types */
import type { FileStore } from '@drizztdourden08/brock-core/platform';

type SpriteStamp = {
  file: string;
  parse: (text: string | null) => string | null;
};

type SpriteManifest = {
  expected: readonly string[] | (() => readonly string[]);
  digest?: string | (() => string);
  stamp?: SpriteStamp;
  dirOf?: (romFile: string) => string;
};

type ExtractionReceipt = { manifest: string; count: number };

type SpriteBuffer = { name: string; bytes: Uint8Array };

type SpriteCheck = { extracted: boolean; count: number };

type SpriteRemoval = { success: boolean; error?: string };

type SpriteUrlOptions = {
  scheme?: string;
  dirOf?: (romFile: string) => string;
};

type SpriteStore = {
  dir: (romFile: string) => string;
  write: (files: FileStore, romFile: string, buffers: SpriteBuffer[]) => Promise<void>;
  check: (files: FileStore, romFile: string) => Promise<SpriteCheck>;
  isStale: (files: FileStore, romFile: string, expectedVersion: string) => Promise<boolean>;
  missing: (files: FileStore, romFile: string) => Promise<string[]>;
  remove: (files: FileStore, romFile: string) => Promise<SpriteRemoval>;
  readFile: (files: FileStore, romFile: string, name: string) => Promise<Uint8Array | null>;
};

type SpriteStoreOptions = { manifest: SpriteManifest };

export type {
  SpriteStamp, SpriteManifest, ExtractionReceipt, SpriteBuffer, SpriteCheck, SpriteRemoval, SpriteUrlOptions,
  SpriteStore, SpriteStoreOptions,
};
