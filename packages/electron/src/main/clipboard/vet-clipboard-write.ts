/* @layer electron-main @kind logic */
import { CLIPBOARD_PNG, CLIPBOARD_TEXT, isPrivateClipboardType } from '@drizztdourden08/brock-core/platform';
import { bytesOf } from '../documents/bytes-of';
import type { ClipboardBundle } from './clipboard-backend.type';
import { CLIPBOARD_LIMITS } from './clipboard-limits.constants';
import { pngSize } from './png-size';
import { refusedType } from './refused-type';

const vetBytes = (value: unknown, type: string): Uint8Array => {
  const bytes = bytesOf(value, `The clipboard type "${type}"`);
  if (bytes.length === 0) throw new Error(`The clipboard type "${type}" has no bytes`);
  if (bytes.length > CLIPBOARD_LIMITS.entryBytes) throw new Error(`The clipboard type "${type}" is over the ${CLIPBOARD_LIMITS.entryBytes} byte limit`);
  return bytes;
};

const vetText = (value: unknown): string => {
  if (typeof value !== 'string') throw new Error('The clipboard type "text/plain" needs a string');
  if (value.length > CLIPBOARD_LIMITS.textChars) throw new Error(`The clipboard text is over the ${CLIPBOARD_LIMITS.textChars} character limit`);
  return value;
};

const vetPng = (value: unknown): Uint8Array => {
  const bytes = vetBytes(value, CLIPBOARD_PNG);
  if (pngSize(bytes) === null) throw new Error('The clipboard type "image/png" is not a whole PNG within the size limits');
  return bytes;
};

const vetEntry = (bundle: ClipboardBundle, productId: string, type: string, value: unknown): void => {
  if (type === CLIPBOARD_TEXT) bundle.text = vetText(value);
  else if (type === CLIPBOARD_PNG) bundle.png = vetPng(value);
  else if (isPrivateClipboardType(productId, type)) bundle.privates.push({ type, data: vetBytes(value, type) });
  else throw refusedType(productId, type);
};

const pairsOf = (entries: unknown): [string, unknown][] => {
  if (typeof entries !== 'object' || entries === null || Array.isArray(entries)) throw new Error('A clipboard write needs an object of types');
  const pairs = Object.entries(entries);
  if (pairs.length === 0 || pairs.length > CLIPBOARD_LIMITS.entries) throw new Error(`A clipboard write needs 1 to ${CLIPBOARD_LIMITS.entries} types`);
  return pairs;
};

const vetClipboardWrite = (productId: string, entries: unknown): ClipboardBundle => {
  const bundle: ClipboardBundle = { privates: [] };
  for (const [type, value] of pairsOf(entries)) vetEntry(bundle, productId, type, value);
  const total = (bundle.png?.length ?? 0) + bundle.privates.reduce((sum, item) => sum + item.data.length, 0);
  if (total > CLIPBOARD_LIMITS.entryBytes) throw new Error(`A clipboard write is over the ${CLIPBOARD_LIMITS.entryBytes} byte limit`);
  return bundle;
};

export { vetClipboardWrite };
