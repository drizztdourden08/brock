/* @layer electron-main @kind logic */
import type { FileHandle } from 'fs/promises';
import { readAt } from './read-at';
import { MAX_16, MAX_32, ZIP64_END_SIGNATURE, ZIP64_END_SIZE, ZIP64_LOCATOR_SIGNATURE, ZIP64_LOCATOR_SIZE } from './zip.constants';
import type { CentralLocation } from './zip.type';

const zip64Location = async (handle: FileHandle, tail: Buffer, end: number): Promise<CentralLocation> => {
  const at = end - ZIP64_LOCATOR_SIZE;
  if (at < 0 || tail.readUInt32LE(at) !== ZIP64_LOCATOR_SIGNATURE) throw new Error('not a zip file: the zip64 locator is missing');
  const record = await readAt(handle, Number(tail.readBigUInt64LE(at + 8)), ZIP64_END_SIZE);
  if (record.length < ZIP64_END_SIZE || record.readUInt32LE(0) !== ZIP64_END_SIGNATURE) throw new Error('not a zip file: the zip64 end record is damaged');
  return { count: Number(record.readBigUInt64LE(32)), size: Number(record.readBigUInt64LE(40)), offset: Number(record.readBigUInt64LE(48)) };
};

const centralLocation = async (handle: FileHandle, tail: Buffer, end: number): Promise<CentralLocation> => {
  const count = tail.readUInt16LE(end + 10);
  const size = tail.readUInt32LE(end + 12);
  const offset = tail.readUInt32LE(end + 16);
  if (count === MAX_16 || size === MAX_32 || offset === MAX_32) return zip64Location(handle, tail, end);
  return { count, size, offset };
};

export { centralLocation };
