/* @layer electron-main @kind logic */
import { CENTRAL_SIGNATURE, CENTRAL_SIZE } from './zip.constants';
import type { ZipRecord } from './zip.type';

const parseCentral = (directory: Buffer, count: number): ZipRecord[] => {
  const records: ZipRecord[] = [];
  let at = 0;
  for (let index = 0; index < count; index += 1) {
    if (directory.readUInt32LE(at) !== CENTRAL_SIGNATURE) throw new Error('not a zip file: the central directory is damaged');
    const nameLength = directory.readUInt16LE(at + 28);
    const extraLength = directory.readUInt16LE(at + 30);
    const commentLength = directory.readUInt16LE(at + 32);
    records.push({
      name: directory.toString('utf8', at + CENTRAL_SIZE, at + CENTRAL_SIZE + nameLength),
      method: directory.readUInt16LE(at + 10),
      time: directory.readUInt16LE(at + 12),
      date: directory.readUInt16LE(at + 14),
      crc: directory.readUInt32LE(at + 16),
      compressed: directory.readUInt32LE(at + 20),
      size: directory.readUInt32LE(at + 24),
      offset: directory.readUInt32LE(at + 42),
    });
    at += CENTRAL_SIZE + nameLength + extraLength + commentLength;
  }
  return records;
};

export { parseCentral };
