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
  const { core, store, profileId, rom, capture, onLoaded, transform } = options;
  const port = core.definition.id;

  const encodeCurrent = async (kind: SaveSlotRef['kind']): Promise<Uint8Array | null> => {
    const raw = coreStateIo.read(core);
    const state = raw && transform?.save ? await transform.save(raw, kind) : raw;
    return state ? encodeSaveSlot({ meta: { port, savedAt: Date.now(), ...(rom ? { rom } : {}) }, state }) : null;
  };

  const loadStateBytes = (bytes: Uint8Array): boolean => {
    const decoded = decodeSaveSlot(bytes, port);
    if (!decoded.ok) return false;
    const state = transform?.load ? transform.load(decoded.record.state) : decoded.record.state;
    if (!coreStateIo.write(core, state)) return false;
    onLoaded?.();
    return true;
  };

  const save = async (ref: SaveSlotRef): Promise<boolean> => {
    const bytes = await encodeCurrent(ref.kind);
    if (!bytes) return false;
    await store.slots.write(profileId, ref, { bytes, screenshot: await pngOf(capture) });
    return true;
  };

  const load = async (ref: SaveSlotRef): Promise<boolean> => {
    const bytes = await store.slots.read(profileId, ref);
    return bytes ? loadStateBytes(bytes) : false;
  };

  const saveNamed = async (kind: NamedSaveKind, name: string): Promise<NamedSaveEntry | null> => {
    const bytes = await encodeCurrent(kind);
    return bytes ? store.named.create(profileId, kind, name, { bytes, screenshot: await pngOf(capture) }) : null;
  };

  const loadNamed = async (kind: NamedSaveKind, name: string): Promise<boolean> => {
    const entry = await store.named.find(profileId, kind, name);
    return entry ? load({ kind, id: entry.id }) : false;
  };

  return { captureState: () => coreStateIo.read(core), loadStateBytes, save, load, saveNamed, loadNamed };
};

export { createSaveSlots };
