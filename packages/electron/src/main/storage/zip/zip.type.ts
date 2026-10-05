/* @layer electron-main @kind types */
interface ZipRecord {
  name: string;
  method: number;
  crc: number;
  compressed: number;
  size: number;
  offset: number;
  time: number;
  date: number;
}

interface ZipWriter {
  add: (name: string, data: Buffer, modified?: Date) => Promise<void>;
  close: () => Promise<void>;
  abort: () => Promise<void>;
}

interface CentralLocation {
  count: number;
  size: number;
  offset: number;
}

interface ZipReader {
  records: ZipRecord[];
  read: (record: ZipRecord) => Promise<Buffer>;
  close: () => Promise<void>;
}

export type { CentralLocation, ZipReader, ZipRecord, ZipWriter };
