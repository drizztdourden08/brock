/* @layer electron-main @kind logic */
import { CLIPBOARD_PNG, CLIPBOARD_TEXT, isPrivateClipboardType } from '@drizztdourden08/brock-core/platform';
import type { ClipboardWireEntries, ClipboardWireValue } from '@drizztdourden08/brock-core/platform';
import type { ClipboardBackend } from './clipboard-backend.type';
import { CLIPBOARD_LIMITS } from './clipboard-limits.constants';
import { refusedType } from './refused-type';

const wireOf = (bytes: Uint8Array): ArrayBuffer => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;

const readText = (backend: ClipboardBackend): string => {
  const text = backend.readText();
  if (text.length > CLIPBOARD_LIMITS.textChars) throw new Error(`The clipboard text is over the ${CLIPBOARD_LIMITS.textChars} character limit`);
  return text;
};

const readPng = (backend: ClipboardBackend): ArrayBuffer | null => {
  const image = backend.readImage();
  if (image === null) return null;
  if (image.width > CLIPBOARD_LIMITS.side || image.height > CLIPBOARD_LIMITS.side || image.width * image.height > CLIPBOARD_LIMITS.pixels) {
    throw new Error('The clipboard image is over the size limit');
  }
  const bytes = image.png();
  if (bytes.length > CLIPBOARD_LIMITS.entryBytes) throw new Error(`The clipboard image is over the ${CLIPBOARD_LIMITS.entryBytes} byte limit`);
  return bytes.length === 0 ? null : wireOf(bytes);
};

const readPrivate = (backend: ClipboardBackend, type: string): ArrayBuffer | null => {
  const bytes = backend.readBuffer(type);
  if (bytes.length > CLIPBOARD_LIMITS.entryBytes) throw new Error(`The clipboard type "${type}" is over the ${CLIPBOARD_LIMITS.entryBytes} byte limit`);
  return bytes.length === 0 ? null : wireOf(bytes);
};

const readOne = (backend: ClipboardBackend, productId: string, type: string): ClipboardWireValue | null => {
  if (type === CLIPBOARD_TEXT) return readText(backend) || null;
  if (type === CLIPBOARD_PNG) return readPng(backend);
  if (isPrivateClipboardType(productId, type)) return readPrivate(backend, type);
  throw refusedType(productId, type);
};

const readClipboard = (backend: ClipboardBackend, productId: string, types: unknown): ClipboardWireEntries => {
  if (!Array.isArray(types) || types.length === 0 || types.length > CLIPBOARD_LIMITS.entries) throw new Error(`A clipboard read needs 1 to ${CLIPBOARD_LIMITS.entries} types`);
  for (const type of types) if (typeof type !== 'string') throw refusedType(productId, type);
  const found: ClipboardWireEntries = {};
  for (const type of new Set(types as string[])) {
    const value = readOne(backend, productId, type);
    if (value !== null) found[type] = value;
  }
  return found;
};

export { readClipboard };
