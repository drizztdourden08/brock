/* @layer core @kind logic */
import JSZip from 'jszip';
import type { ZipEntry } from './zip-entry.type';
import type { ZipOptions } from './zip-options.type';
import { ZIP_FIXED_DATE } from './zip.constants';

const methodFor = (store: boolean): 'STORE' | 'DEFLATE' => (store ? 'STORE' : 'DEFLATE');

const zipEntries = async (entries: ZipEntry[], options?: ZipOptions): Promise<Uint8Array> => {
  const { store: defaultStore = true } = options ?? {};
  const zip = new JSZip();
  for (const entry of entries) {
    zip.file(entry.name, entry.bytes, {
      binary: true,
      createFolders: false,
      date: ZIP_FIXED_DATE,
      compression: methodFor(entry.store ?? defaultStore),
    });
  }
  return zip.generateAsync({ type: 'uint8array', compression: methodFor(defaultStore) });
};

export { zipEntries };
