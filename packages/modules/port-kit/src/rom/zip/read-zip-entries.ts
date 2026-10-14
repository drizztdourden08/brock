/* @layer core @kind logic */
import type { ZipEntry, ZipEntryInfo } from './zip-read.type';
import {
  ZIP_CENTRAL_BYTES, ZIP_CENTRAL_MAGIC, ZIP_DEFLATED, ZIP_ENCRYPTED_FLAG, ZIP_END_BYTES, ZIP_END_MAGIC, ZIP_END_SEARCH,
  ZIP_LOCAL_BYTES, ZIP_LOCAL_MAGIC, ZIP_STORED,
} from './zip-read.constants';
import { inflateRaw } from './inflate-raw';

const viewOf = (bytes: Uint8Array): DataView => new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

const endRecordAt = (view: DataView): number => {
  const floor = Math.max(0, view.byteLength - ZIP_END_SEARCH);
  for (let at = view.byteLength - ZIP_END_BYTES; at >= floor; at -= 1) {
    if (view.getUint32(at, true) === ZIP_END_MAGIC) return at;
  }
  throw new Error('Not a zip archive: no end record.');
};

const centralEntries = (bytes: Uint8Array, view: DataView): ZipEntryInfo[] => {
  const end = endRecordAt(view);
  const count = view.getUint16(end + 10, true);
  let at = view.getUint32(end + 16, true);
  const out: ZipEntryInfo[] = [];
  for (let i = 0; i < count; i += 1) {
    if (at + ZIP_CENTRAL_BYTES > bytes.length || view.getUint32(at, true) !== ZIP_CENTRAL_MAGIC) throw new Error('Zip central directory is damaged.');
    const nameLength = view.getUint16(at + 28, true);
    out.push({
      name: new TextDecoder().decode(bytes.subarray(at + ZIP_CENTRAL_BYTES, at + ZIP_CENTRAL_BYTES + nameLength)),
      method: view.getUint16(at + 10, true),
      encrypted: (view.getUint16(at + 8, true) & ZIP_ENCRYPTED_FLAG) !== 0,
      compressedSize: view.getUint32(at + 20, true),
      size: view.getUint32(at + 24, true),
      localOffset: view.getUint32(at + 42, true),
    });
    at += ZIP_CENTRAL_BYTES + nameLength + view.getUint16(at + 30, true) + view.getUint16(at + 32, true);
  }
  return out;
};

const readEntry = async (bytes: Uint8Array, view: DataView, info: ZipEntryInfo): Promise<Uint8Array> => {
  const at = info.localOffset;
  if (view.getUint32(at, true) !== ZIP_LOCAL_MAGIC) throw new Error(`Zip entry "${info.name}" is damaged.`);
  const start = at + ZIP_LOCAL_BYTES + view.getUint16(at + 26, true) + view.getUint16(at + 28, true);
  const data = bytes.subarray(start, start + info.compressedSize);
  if (data.length !== info.compressedSize) throw new Error(`Zip entry "${info.name}" is cut short.`);
  if (info.method === ZIP_STORED) return data.slice();
  const out = await inflateRaw(data);
  if (out.length !== info.size) throw new Error(`Zip entry "${info.name}" did not unpack to its size.`);
  return out;
};

const readable = (info: ZipEntryInfo): boolean =>
  !info.name.endsWith('/') && !info.encrypted && (info.method === ZIP_STORED || info.method === ZIP_DEFLATED);

const readZipEntries = (bytes: Uint8Array): ZipEntry[] => {
  const view = viewOf(bytes);
  return centralEntries(bytes, view).filter(readable).map((info) => ({
    name: info.name.split('/').pop() ?? info.name,
    size: info.size,
    read: () => readEntry(bytes, view, info),
  }));
};

export { readZipEntries };
