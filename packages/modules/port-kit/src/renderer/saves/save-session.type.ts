/* @layer renderer-shell @kind types */
import type { SaveStore, SramStore } from '../../saves/save-store.type';
import type { NamedSaveEntry, NamedSaveKind, SaveSlotRef } from '../../saves/save-slot.type';
import type { GameCore } from '../core/game-core.type';

type SramSource = Pick<GameCore, 'definition' | 'calls' | 'fs'>;

interface SramSyncBase {
  store: SramStore;
  profileId: string;
  intervalMs?: number;
}

type SramSyncOptions = SramSyncBase & ({ core: SramSource } | { read: () => Uint8Array | null });

interface SramSync {
  start: () => void;
  stop: () => Promise<void>;
  pause: () => void;
  resume: () => void;
  flush: () => Promise<boolean>;
}

interface SaveTransform {
  save?: (state: Uint8Array, kind: SaveSlotRef['kind']) => Uint8Array | Promise<Uint8Array>;
  load?: (state: Uint8Array) => Uint8Array;
}

interface SaveSlotsOptions {
  core: GameCore;
  store: SaveStore;
  profileId: string;
  rom?: string;
  capture?: () => Promise<Blob | null>;
  onLoaded?: () => void;
  transform?: SaveTransform;
}

interface SaveSlots {
  captureState: () => Uint8Array | null;
  loadStateBytes: (state: Uint8Array) => boolean;
  save: (ref: SaveSlotRef) => Promise<boolean>;
  load: (ref: SaveSlotRef) => Promise<boolean>;
  saveNamed: (kind: NamedSaveKind, name: string) => Promise<NamedSaveEntry | null>;
  loadNamed: (kind: NamedSaveKind, name: string) => Promise<boolean>;
}

export type { SramSource, SramSyncOptions, SramSync, SaveTransform, SaveSlotsOptions, SaveSlots };
