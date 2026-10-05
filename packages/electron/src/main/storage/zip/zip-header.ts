/* @layer electron-main @kind logic */
import { CENTRAL_SIGNATURE, CENTRAL_SIZE, LOCAL_SIGNATURE, LOCAL_SIZE, MAX_32, UTF8_FLAG, ZIP64_VERSION, ZIP_VERSION } from './zip.constants';
import { zip64Extra } from './zip64-extra';
import type { ZipRecord } from './zip.type';

const clamp = (value: number): number => Math.min(value, MAX_32);

const wideFields = (record: ZipRecord, local: boolean): number[] => {
  if (local) return record.size >= MAX_32 || record.compressed >= MAX_32 ? [record.size, record.compressed] : [];
  return [record.size, record.compressed, record.offset].filter((value) => value >= MAX_32);
};

const writeShared = (head: Buffer, at: number, record: ZipRecord, lengths: { name: number; extra: number }): void => {
  head.writeUInt16LE(UTF8_FLAG, at);
  head.writeUInt16LE(record.method, at + 2);
  head.writeUInt16LE(record.time, at + 4);
  head.writeUInt16LE(record.date, at + 6);
  head.writeUInt32LE(record.crc, at + 8);
  head.writeUInt32LE(clamp(record.compressed), at + 12);
  head.writeUInt32LE(clamp(record.size), at + 16);
  head.writeUInt16LE(lengths.name, at + 20);
  head.writeUInt16LE(lengths.extra, at + 22);
};

const zipHeader = (record: ZipRecord, kind: 'local' | 'central'): Buffer => {
  const name = Buffer.from(record.name, 'utf8');
  const local = kind === 'local';
  const extra = zip64Extra(wideFields(record, local));
  const version = extra.length > 0 ? ZIP64_VERSION : ZIP_VERSION;
  const lengths = { name: name.length, extra: extra.length };
  const head = Buffer.alloc(local ? LOCAL_SIZE : CENTRAL_SIZE);
  head.writeUInt32LE(local ? LOCAL_SIGNATURE : CENTRAL_SIGNATURE, 0);
  head.writeUInt16LE(version, 4);
  if (local) {
    writeShared(head, 6, record, lengths);
  } else {
    head.writeUInt16LE(version, 6);
    writeShared(head, 8, record, lengths);
    head.writeUInt32LE(clamp(record.offset), 42);
  }
  return Buffer.concat([head, name, extra]);
};

export { zipHeader };
