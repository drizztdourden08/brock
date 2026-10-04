/* @layer electron-main @kind logic */
import { open, rm } from 'fs/promises';
import { crc32, deflateRawSync } from 'zlib';
import { dosStamp } from './dos-stamp';
import { endRecord } from './end-record';
import { zipHeader } from './zip-header';
import { DEFLATED, ENTRY_LIMIT, LIMIT_MESSAGE, STORED, ZIP_LIMIT } from './zip.constants';
import type { ZipRecord, ZipWriter } from './zip.type';

const createZipWriter = async (path: string): Promise<ZipWriter> => {
  const handle = await open(path, 'w');
  const records: ZipRecord[] = [];
  let offset = 0;
  const write = async (data: Buffer): Promise<void> => {
    await handle.write(data);
    offset += data.length;
  };
  const add = async (name: string, data: Buffer, modified = new Date()): Promise<void> => {
    const packed = deflateRawSync(data);
    const method = packed.length < data.length ? DEFLATED : STORED;
    const body = method === DEFLATED ? packed : data;
    if (records.length >= ENTRY_LIMIT || offset + body.length > ZIP_LIMIT) throw new Error(LIMIT_MESSAGE);
    const record: ZipRecord = { name, method, crc: crc32(data), compressed: body.length, size: data.length, offset, ...dosStamp(modified) };
    records.push(record);
    await write(zipHeader(record, 'local'));
    await write(body);
  };
  const close = async (): Promise<void> => {
    const start = offset;
    for (const record of records) await write(zipHeader(record, 'central'));
    if (offset > ZIP_LIMIT) throw new Error(LIMIT_MESSAGE);
    await write(endRecord(records.length, offset - start, start));
    await handle.close();
  };
  const abort = async (): Promise<void> => {
    await handle.close().catch(() => undefined);
    await rm(path, { force: true });
  };
  return { add, close, abort };
};

export { createZipWriter };
