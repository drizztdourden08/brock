/* @layer renderer-shell @kind types */
import type { SaveStore, SramStore } from '../../saves/save-store.type';
import type { NamedSaveEntry, NamedSaveKind, SaveSlotRef } from '../../saves/save-slot.type';
import type { GameCore } from '../core/game-core.type';

interface SramSyncOptions {
  core: GameCore;
  store: SramStore;
  profileId: string;
  intervalMs?: number;
}

interface SramSync {
  start: () => void;
  stop: () => Promise<void>;
  pause: () => void;
  resume: () => void;
  flush: () => Promise<boolean>;
}

interface SaveSlotsOptions {
  core: GameCore;
  store: SaveStore;
  profileId: string;
  rom?: string;
  capture?: () => Promise<Blob | null>;
  onLoaded?: () => void;
}

interface SaveSlots {
  captureState: () => Uint8Array | null;
  loadStateBytes: (state: Uint8Array) => boolean;
  save: (ref: SaveSlotRef) => Promise<boolean>;
  load: (ref: SaveSlotRef) => Promise<boolean>;
  saveNamed: (kind: NamedSaveKind, name: string) => Promise<NamedSaveEntry | null>;
  loadNamed: (kind: NamedSaveKind, name: string) => Promise<boolean>;
}

export type { SramSyncOptions, SramSync, SaveSlotsOptions, SaveSlots };
