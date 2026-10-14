/* @layer core @kind types */
import type { NamedSaveEntry, NamedSaveInfo, NamedSaveKind, NamedSavePrune, QuickSlotInfo, SaveSlotRef } from './save-slot.type';

interface SramStore {
  read: (profileId: string) => Promise<Uint8Array | null>;
  write: (profileId: string, bytes: Uint8Array) => Promise<void>;
}

interface SlotWrite {
  bytes: Uint8Array;
  screenshot?: Uint8Array | null;
}

interface NamedSaveWrite extends SlotWrite {
  meta?: Record<string, unknown>;
}

interface SlotStore {
  write: (profileId: string, ref: SaveSlotRef, data: SlotWrite) => Promise<void>;
  read: (profileId: string, ref: SaveSlotRef) => Promise<Uint8Array | null>;
  readScreenshot: (profileId: string, ref: SaveSlotRef) => Promise<Uint8Array | null>;
  remove: (profileId: string, ref: SaveSlotRef) => Promise<void>;
  bytesOf: (profileId: string, ref: SaveSlotRef) => Promise<number | null>;
  listQuick: (profileId: string) => Promise<QuickSlotInfo[]>;
}

interface NamedSaveStore {
  create: (profileId: string, kind: NamedSaveKind, name: string, data: NamedSaveWrite) => Promise<NamedSaveEntry>;
  list: (profileId: string, kind: NamedSaveKind) => Promise<NamedSaveEntry[]>;
  details: (profileId: string, kind: NamedSaveKind) => Promise<NamedSaveInfo[]>;
  find: (profileId: string, kind: NamedSaveKind, name: string) => Promise<NamedSaveEntry | null>;
  rename: (profileId: string, kind: NamedSaveKind, id: string, name: string) => Promise<NamedSaveEntry | null>;
  overwrite: (profileId: string, kind: NamedSaveKind, id: string, data: NamedSaveWrite) => Promise<NamedSaveEntry | null>;
  prune: (profileId: string, kind: NamedSaveKind, rules: NamedSavePrune) => Promise<NamedSaveEntry[]>;
  size: (profileId: string, kind: NamedSaveKind) => Promise<number>;
  remove: (profileId: string, kind: NamedSaveKind, id: string) => Promise<void>;
}

interface NamedSaveManifest {
  read: () => Promise<NamedSaveEntry[]>;
  write: (entries: NamedSaveEntry[]) => Promise<void>;
}

interface SaveStore {
  sram: SramStore;
  slots: SlotStore;
  named: NamedSaveStore;
}

interface SaveStoreOptions {
  companions?: (profileId: string, ref: SaveSlotRef) => string[];
}

export type { SramStore, SlotWrite, NamedSaveWrite, SlotStore, NamedSaveStore, NamedSaveManifest, SaveStore, SaveStoreOptions };
