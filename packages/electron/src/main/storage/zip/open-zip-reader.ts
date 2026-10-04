/* @layer electron-main @kind logic */
import { open } from 'fs/promises';
import type { FileHandle } from 'fs/promises';
import { crc32, inflateRawSync } from 'zlib';
import { parseCentral } from './parse-central';
import { DEFLATED, END_SEARCH, END_SIGNATURE, LOCAL_SIGNATURE, LOCAL_SIZE, STORED } from './zip.constants';
import type { ZipReader, ZipRecord } from './zip.type';

const readAt = async (handle: FileHandle, position: number, length: number): Promise<Buffer> => {
  const buffer = Buffer.alloc(length);
  const { bytesRead } = await handle.read(buffer, 0, length, position);
  return buffer.subarray(0, bytesRead);
};

const findEnd = (tail: Buffer): number => {
  for (let at = tail.length - 22; at >= 0; at -= 1) if (tail.readUInt32LE(at) === END_SIGNATURE) return at;
  throw new Error('not a zip file: no end of central directory');
};

const readRecord = async (handle: FileHandle, record: ZipRecord): Promise<Buffer> => {
  const head = await readAt(handle, record.offset, LOCAL_SIZE);
  if (head.length < LOCAL_SIZE || head.readUInt32LE(0) !== LOCAL_SIGNATURE) throw new Error(`zip entry ${record.name} is damaged`);
  const start = record.offset + LOCAL_SIZE + head.readUInt16LE(26) + head.readUInt16LE(28);
  const body = await readAt(handle, start, record.compressed);
  if (record.method !== STORED && record.method !== DEFLATED) throw new Error(`zip entry ${record.name} uses an unsupported compression`);
  const data = record.method === DEFLATED ? inflateRawSync(body) : body;
  if (crc32(data) !== record.crc) throw new Error(`zip entry ${record.name} failed its checksum`);
  return data;
};

const openZipReader = async (path: string): Promise<ZipReader> => {
  const handle = await open(path, 'r');
  try {
    const { size } = await handle.stat();
    const tailStart = Math.max(0, size - END_SEARCH);
    const tail = await readAt(handle, tailStart, size - tailStart);
    const end = findEnd(tail);
    const count = tail.readUInt16LE(end + 10);
    const directory = await readAt(handle, tail.readUInt32LE(end + 16), tail.readUInt32LE(end + 12));
    return { records: parseCentral(directory, count), read: (record) => readRecord(handle, record), close: () => handle.close() };
  } catch (err) {
    await handle.close();
    throw err;
  }
};

export { openZipReader };
