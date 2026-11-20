/* @layer electron-main @kind logic */
import * as electron from 'electron';
import type { ClipboardBackend } from './clipboard-backend.type';
import { asyncClipboard } from './async-clipboard';
import { clipboardItemOf } from './clipboard-item-of';
import { isAsyncClipboard } from './is-async-clipboard';
import { isLegacyClipboard } from './is-legacy-clipboard';
import { legacyClipboard } from './legacy-clipboard';

const pickBackend = (ownPrefix: string): ClipboardBackend => {
  const board: object = electron.clipboard;
  if (isLegacyClipboard(board)) return legacyClipboard(board, ownPrefix);
  const Item = clipboardItemOf(electron);
  if (isAsyncClipboard(board) && Item !== null) return asyncClipboard(board, Item, ownPrefix);
  throw new Error('This Electron version has no clipboard API that Brock can use');
};

const electronClipboard = (ownPrefix: string): ClipboardBackend => {
  let picked: ClipboardBackend | null = null;
  const backend = (): ClipboardBackend => (picked ??= pickBackend(ownPrefix));

  return {
    readText: () => backend().readText(),
    readBuffer: (type) => backend().readBuffer(type),
    readImage: () => backend().readImage(),
    write: (bundle) => backend().write(bundle),
    fingerprint: () => backend().fingerprint(),
  };
};

export { electronClipboard };
