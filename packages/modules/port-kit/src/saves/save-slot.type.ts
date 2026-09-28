/* @layer core @kind types */
type NamedSaveKind = 'normal' | 'auto';

type SaveSlotRef = { kind: 'quick'; slot: number } | { kind: NamedSaveKind; id: string };

interface SaveSlotMeta {
  port: string;
  savedAt: number;
  rom?: string;
  label?: string;
}

interface SaveSlotRecord {
  meta: SaveSlotMeta;
  state: Uint8Array;
}

type SaveSlotFailure = 'magic' | 'version' | 'port' | 'corrupt';

type SaveSlotDecode =
  | { ok: true; record: SaveSlotRecord }
  | { ok: false; reason: SaveSlotFailure; message: string };

interface SaveSlotPaths {
  state: string;
  screenshot: string;
}

interface NamedSaveEntry {
  id: string;
  name: string;
  savedAt: number;
  hasScreenshot: boolean;
}

interface QuickSlotInfo {
  slot: number;
  savedAt: number;
  hasScreenshot: boolean;
}

export type {
  NamedSaveKind, SaveSlotRef, SaveSlotMeta, SaveSlotRecord, SaveSlotFailure, SaveSlotDecode, SaveSlotPaths,
  NamedSaveEntry, QuickSlotInfo,
};
