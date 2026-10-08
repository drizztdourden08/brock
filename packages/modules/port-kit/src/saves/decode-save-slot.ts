/* @layer core @kind logic */
import type { SaveSlotDecode, SaveSlotDecodeOptions, SaveSlotMeta } from './save-slot.type';
import { SAVE_SLOT_HEADER_BYTES, SAVE_SLOT_MAGIC, SAVE_SLOT_VERSION } from './save-slot.constants';

const hasMagic = (bytes: Uint8Array): boolean => SAVE_SLOT_MAGIC.every((value, i) => bytes[i] === value);

const parseMeta = (bytes: Uint8Array): SaveSlotMeta | null => {
  try {
    const meta: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (typeof meta !== 'object' || meta === null) return null;
    const { port, savedAt } = meta as Partial<SaveSlotMeta>;
    return typeof port === 'string' && typeof savedAt === 'number' ? (meta as SaveSlotMeta) : null;
  } catch {
    return null;
  }
};

const decodeRaw = (bytes: Uint8Array, port: string, acceptRaw: boolean): SaveSlotDecode => {
  if (!acceptRaw || bytes.length === 0) return { ok: false, reason: 'magic', message: 'Not a save slot file.' };
  return { ok: true, format: 'raw', record: { meta: { port, savedAt: 0 }, state: bytes.slice() } };
};

const decodeSaveSlot = (bytes: Uint8Array, port: string, { acceptRaw = true }: SaveSlotDecodeOptions = {}): SaveSlotDecode => {
  if (!hasMagic(bytes)) return decodeRaw(bytes, port, acceptRaw);
  if (bytes.length < SAVE_SLOT_HEADER_BYTES) return { ok: false, reason: 'corrupt', message: 'Save slot header is cut short.' };
  if (bytes[4] !== SAVE_SLOT_VERSION) return { ok: false, reason: 'version', message: `Save slot version ${bytes[4]} is not supported.` };
  const metaLength = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(5, true);
  const stateStart = SAVE_SLOT_HEADER_BYTES + metaLength;
  if (stateStart > bytes.length) return { ok: false, reason: 'corrupt', message: 'Save slot header runs past the end of the file.' };
  const meta = parseMeta(bytes.subarray(SAVE_SLOT_HEADER_BYTES, stateStart));
  if (!meta) return { ok: false, reason: 'corrupt', message: 'Save slot metadata is unreadable.' };
  if (meta.port !== port) return { ok: false, reason: 'port', message: `Save slot belongs to "${meta.port}", not "${port}".` };
  return { ok: true, format: 'pksv', record: { meta, state: bytes.slice(stateStart) } };
};

export { decodeSaveSlot };
