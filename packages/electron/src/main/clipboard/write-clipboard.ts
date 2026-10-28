/* @layer electron-main @kind logic */
import type { ClipboardBackend, ClipboardBundle } from './clipboard-backend.type';
import { vetClipboardWrite } from './vet-clipboard-write';

const plain = (text: string): string => text.replace(/\r\n/g, '\n');

const same = (a: Uint8Array, b: Uint8Array): boolean => a.length === b.length && a.every((value, index) => value === b[index]);

const lost = (type: string): Error => new Error(`The clipboard did not keep "${type}"; another program may hold the clipboard`);

const verify = (backend: ClipboardBackend, bundle: ClipboardBundle): void => {
  if (bundle.text !== undefined && plain(backend.readText()) !== plain(bundle.text)) throw lost('text/plain');
  if (bundle.png !== undefined && backend.readImage() === null) throw lost('image/png');
  for (const item of bundle.privates) if (!same(backend.readBuffer(item.type), item.data)) throw lost(item.type);
};

const writeClipboard = (backend: ClipboardBackend, productId: string, entries: unknown): void => {
  const bundle = vetClipboardWrite(productId, entries);
  backend.write(bundle);
  verify(backend, bundle);
};

export { writeClipboard };
