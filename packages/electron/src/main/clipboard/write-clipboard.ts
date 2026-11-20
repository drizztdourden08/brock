/* @layer electron-main @kind logic */
import type { ClipboardBackend, ClipboardBundle } from './clipboard-backend.type';
import { vetClipboardWrite } from './vet-clipboard-write';

const plain = (text: string): string => text.replace(/\r\n/g, '\n');

const same = (a: Uint8Array, b: Uint8Array): boolean => a.length === b.length && a.every((value, index) => value === b[index]);

const lost = (type: string): Error => new Error(`The clipboard did not keep "${type}"; another program may hold the clipboard`);

const verify = async (backend: ClipboardBackend, bundle: ClipboardBundle): Promise<void> => {
  if (bundle.text !== undefined && plain(await backend.readText()) !== plain(bundle.text)) throw lost('text/plain');
  if (bundle.png !== undefined && (await backend.readImage()) === null) throw lost('image/png');
  for (const item of bundle.privates) if (!same(await backend.readBuffer(item.type), item.data)) throw lost(item.type);
};

const writeClipboard = async (backend: ClipboardBackend, productId: string, entries: unknown): Promise<void> => {
  const bundle = vetClipboardWrite(productId, entries);
  await backend.write(bundle);
  await verify(backend, bundle);
};

export { writeClipboard };
