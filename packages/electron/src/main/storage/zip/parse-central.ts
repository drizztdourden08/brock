/* @layer electron-main @kind logic */
import { CENTRAL_SIGNATURE, CENTRAL_SIZE } from './zip.constants';
import { widen } from './zip64-extra';
import type { ZipRecord } from './zip.type';

const parseCentral = (directory: Buffer, count: number): ZipRecord[] => {
  const records: ZipRecord[] = [];
  let at = 0;
  for (let index = 0; index < count; index += 1) {
    if (directory.readUInt32LE(at) !== CENTRAL_SIGNATURE) throw new Error('not a zip file: the central directory is damaged');
    const nameLength = directory.readUInt16LE(at + 28);
    const extraLength = directory.readUInt16LE(at + 30);
    const commentLength = directory.readUInt16LE(at + 32);
    const extraStart = at + CENTRAL_SIZE + nameLength;
    const [size = 0, compressed = 0, offset = 0] = widen(
      [directory.readUInt32LE(at + 24), directory.readUInt32LE(at + 20), directory.readUInt32LE(at + 42)],
      directory.subarray(extraStart, extraStart + extraLength),
    );
    records.push({
      name: directory.toString('utf8', at + CENTRAL_SIZE, extraStart),
      method: directory.readUInt16LE(at + 10),
      time: directory.readUInt16LE(at + 12),
      date: directory.readUInt16LE(at + 14),
      crc: directory.readUInt32LE(at + 16),
      compressed,
      size,
      offset,
    });
    at = extraStart + extraLength + commentLength;
  }
  return records;
};

export { parseCentral };
