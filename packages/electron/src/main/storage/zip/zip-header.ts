/* @layer electron-main @kind logic */
import { CENTRAL_SIGNATURE, CENTRAL_SIZE, LOCAL_SIGNATURE, LOCAL_SIZE, UTF8_FLAG, ZIP_VERSION } from './zip.constants';
import type { ZipRecord } from './zip.type';

const writeShared = (head: Buffer, at: number, record: ZipRecord, nameLength: number): void => {
  head.writeUInt16LE(UTF8_FLAG, at);
  head.writeUInt16LE(record.method, at + 2);
  head.writeUInt16LE(record.time, at + 4);
  head.writeUInt16LE(record.date, at + 6);
  head.writeUInt32LE(record.crc, at + 8);
  head.writeUInt32LE(record.compressed, at + 12);
  head.writeUInt32LE(record.size, at + 16);
  head.writeUInt16LE(nameLength, at + 20);
};

const zipHeader = (record: ZipRecord, kind: 'local' | 'central'): Buffer => {
  const name = Buffer.from(record.name, 'utf8');
  const local = kind === 'local';
  const head = Buffer.alloc(local ? LOCAL_SIZE : CENTRAL_SIZE);
  head.writeUInt32LE(local ? LOCAL_SIGNATURE : CENTRAL_SIGNATURE, 0);
  head.writeUInt16LE(ZIP_VERSION, 4);
  if (local) {
    writeShared(head, 6, record, name.length);
  } else {
    head.writeUInt16LE(ZIP_VERSION, 6);
    writeShared(head, 8, record, name.length);
    head.writeUInt32LE(record.offset, 42);
  }
  return Buffer.concat([head, name]);
};

export { zipHeader };
