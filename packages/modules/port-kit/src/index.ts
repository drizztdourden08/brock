/* @layer core @kind barrel */
import './augment';

export { definePort } from './port/define-port';
export type {
  CoreCalls, CoreFiles, CoreExports, CoreDefinition, EmscriptenVideo, FramebufferVideo, VideoDefinition,
  EmscriptenAudio, SampleAudio, AudioDefinition, LiveSettingsDefinition, AssetsDefinition, SavesDefinition,
  PortDefinition,
} from './port/port-definition.type';
export type { PortKitApi } from './port-kit.type';

export { sha1Hex } from './rom/sha1-hex';
export { identifyRom } from './rom/identify-rom';
export { hasRomExtension } from './rom/has-rom-extension';
export { createRomStore } from './rom/create-rom-store';
export { ROMS_DIR, ASSETS_DIR, MAIN_ROM_KIND } from './rom/rom-files.constants';
export { readZipEntries } from './rom/zip/read-zip-entries';
export type { ZipEntry } from './rom/zip/zip-read.type';
export type {
  RomFileName, RomIdentity, RomDerived, RomRules, RomKindDefinition, RomDefinition, RomImage, RomRefusal, RomCheck, StoredRom,
} from './rom/rom.type';
export type { RomImport, RomKindStore, RomStore } from './rom/rom-store.type';

export { runAssetPipeline } from './assets/run-asset-pipeline';
export { packAssetChunks } from './assets/pack-asset-chunks';
export { createAssetCache } from './assets/create-asset-cache';
export type { AssetChunk, AssetExtractor, AssetPacker, AssetProgress, AssetPipelineRequest } from './assets/asset-pipeline.type';
export type { AssetCache } from './assets/asset-cache.type';
export type { AssetStepReport, AssetWorkerStep, AssetWorkerSteps, AssetWorkerStepDef } from './assets/worker/asset-worker.type';

export { encodeSaveSlot } from './saves/encode-save-slot';
export { decodeSaveSlot } from './saves/decode-save-slot';
export { saveSlotPaths } from './saves/save-slot-paths';
export { quickSlotOf } from './saves/quick-slot-of';
export { createSaveStore } from './saves/create-save-store';
export type {
  NamedSaveKind, SaveSlotRef, SaveSlotMeta, SaveSlotRecord, SaveSlotFailure, SaveSlotFormat, SaveSlotDecodeOptions,
  SaveSlotDecode, SaveSlotPaths, NamedSaveEntry, NamedSaveInfo, NamedSavePrune, QuickSlotInfo,
} from './saves/save-slot.type';
export type { SramStore, SlotWrite, NamedSaveWrite, SlotStore, NamedSaveStore, SaveStore, SaveStoreOptions } from './saves/save-store.type';
