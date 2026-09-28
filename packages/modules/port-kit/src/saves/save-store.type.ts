/* @layer core @kind types */
import type { NamedSaveEntry, NamedSaveKind, QuickSlotInfo, SaveSlotRef } from './save-slot.type';

interface SramStore {
  read: (profileId: string) => Promise<Uint8Array | null>;
  write: (profileId: string, bytes: Uint8Array) => Promise<void>;
}

interface SlotWrite {
  bytes: Uint8Array;
  screenshot?: Uint8Array | null;
}

interface SlotStore {
  write: (profileId: string, ref: SaveSlotRef, data: SlotWrite) => Promise<void>;
  read: (profileId: string, ref: SaveSlotRef) => Promise<Uint8Array | null>;
  readScreenshot: (profileId: string, ref: SaveSlotRef) => Promise<Uint8Array | null>;
  remove: (profileId: string, ref: SaveSlotRef) => Promise<void>;
  listQuick: (profileId: string) => Promise<QuickSlotInfo[]>;
}

interface NamedSaveStore {
  create: (profileId: string, kind: NamedSaveKind, name: string, data: SlotWrite) => Promise<NamedSaveEntry>;
  list: (profileId: string, kind: NamedSaveKind) => Promise<NamedSaveEntry[]>;
  find: (profileId: string, kind: NamedSaveKind, name: string) => Promise<NamedSaveEntry | null>;
  remove: (profileId: string, kind: NamedSaveKind, id: string) => Promise<void>;
}

interface SaveStore {
  sram: SramStore;
  slots: SlotStore;
  named: NamedSaveStore;
}

export type { SramStore, SlotWrite, SlotStore, NamedSaveStore, SaveStore };
