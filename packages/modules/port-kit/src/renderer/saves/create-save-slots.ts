/* @layer renderer-shell @kind logic */
import { decodeSaveSlot } from '../../saves/decode-save-slot';
import { encodeSaveSlot } from '../../saves/encode-save-slot';
import type { NamedSaveEntry, NamedSaveKind, SaveSlotRef } from '../../saves/save-slot.type';
import type { SaveSlots, SaveSlotsOptions } from './save-session.type';
import { coreStateIo } from './core-state-io';

const pngOf = async (capture: SaveSlotsOptions['capture']): Promise<Uint8Array | null> => {
  const blob = capture ? await capture() : null;
  return blob ? new Uint8Array(await blob.arrayBuffer()) : null;
};

const createSaveSlots = (options: SaveSlotsOptions): SaveSlots => {
  const { core, store, profileId, rom, capture, onLoaded } = options;
  const port = core.definition.id;

  const encodeCurrent = (): Uint8Array | null => {
    const state = coreStateIo.read(core);
    return state ? encodeSaveSlot({ meta: { port, savedAt: Date.now(), ...(rom ? { rom } : {}) }, state }) : null;
  };

  const loadStateBytes = (bytes: Uint8Array): boolean => {
    const decoded = decodeSaveSlot(bytes, port);
    if (!decoded.ok || !coreStateIo.write(core, decoded.record.state)) return false;
    onLoaded?.();
    return true;
  };

  const save = async (ref: SaveSlotRef): Promise<boolean> => {
    const bytes = encodeCurrent();
    if (!bytes) return false;
    await store.slots.write(profileId, ref, { bytes, screenshot: await pngOf(capture) });
    return true;
  };

  const load = async (ref: SaveSlotRef): Promise<boolean> => {
    const bytes = await store.slots.read(profileId, ref);
    return bytes ? loadStateBytes(bytes) : false;
  };

  const saveNamed = async (kind: NamedSaveKind, name: string): Promise<NamedSaveEntry | null> => {
    const bytes = encodeCurrent();
    return bytes ? store.named.create(profileId, kind, name, { bytes, screenshot: await pngOf(capture) }) : null;
  };

  const loadNamed = async (kind: NamedSaveKind, name: string): Promise<boolean> => {
    const entry = await store.named.find(profileId, kind, name);
    return entry ? load({ kind, id: entry.id }) : false;
  };

  return { captureState: () => coreStateIo.read(core), loadStateBytes, save, load, saveNamed, loadNamed };
};

export { createSaveSlots };
