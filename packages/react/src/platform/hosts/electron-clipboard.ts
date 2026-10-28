/* @layer renderer-shell @kind logic */
import type { ClipboardEntries, ClipboardPort, ClipboardWireEntries } from '@drizztdourden08/brock-core';
import { requireHostApi } from '../../host/require-host-api';
import { toArrayBuffer } from './to-array-buffer';
import { watchClipboard } from './watch-clipboard';

const toWire = (entries: ClipboardEntries): ClipboardWireEntries =>
  Object.fromEntries(Object.entries(entries).map(([type, value]) => [type, typeof value === 'string' ? value : toArrayBuffer(value)]));

const fromWire = (entries: ClipboardWireEntries): ClipboardEntries =>
  Object.fromEntries(Object.entries(entries).map(([type, value]) => [type, typeof value === 'string' ? value : new Uint8Array(value)]));

const createElectronClipboard = (): ClipboardPort => {
  const api = requireHostApi();
  return {
    readText: () => api.clipboardReadText(),
    write: (entries) => api.clipboardWrite(toWire(entries)),
    read: async (types) => fromWire(await api.clipboardRead(types)),
    onChange: (listener) => watchClipboard(api, listener),
  };
};

export { createElectronClipboard };
