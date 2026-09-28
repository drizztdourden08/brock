/* @layer core @kind logic */
import type { SaveSlotRecord } from './save-slot.type';
import { SAVE_SLOT_HEADER_BYTES, SAVE_SLOT_MAGIC, SAVE_SLOT_VERSION } from './save-slot.constants';

const encodeSaveSlot = ({ meta, state }: SaveSlotRecord): Uint8Array => {
  const metaBytes = new TextEncoder().encode(JSON.stringify(meta));
  const out = new Uint8Array(SAVE_SLOT_HEADER_BYTES + metaBytes.length + state.length);
  out.set(SAVE_SLOT_MAGIC, 0);
  out[4] = SAVE_SLOT_VERSION;
  new DataView(out.buffer).setUint32(5, metaBytes.length, true);
  out.set(metaBytes, SAVE_SLOT_HEADER_BYTES);
  out.set(state, SAVE_SLOT_HEADER_BYTES + metaBytes.length);
  return out;
};

export { encodeSaveSlot };
