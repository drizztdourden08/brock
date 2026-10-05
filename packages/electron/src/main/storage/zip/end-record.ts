/* @layer electron-main @kind logic */
import {
  END_SIGNATURE, END_SIZE, MAX_16, MAX_32, ZIP64_END_SIGNATURE, ZIP64_END_SIZE, ZIP64_LIMITS, ZIP64_LOCATOR_SIGNATURE, ZIP64_LOCATOR_SIZE, ZIP64_VERSION,
} from './zip.constants';
import type { ZipLimits } from './zip.type';

const zip64End = (count: number, size: number, offset: number): Buffer => {
  const end = Buffer.alloc(ZIP64_END_SIZE);
  end.writeUInt32LE(ZIP64_END_SIGNATURE, 0);
  end.writeBigUInt64LE(BigInt(ZIP64_END_SIZE - 12), 4);
  end.writeUInt16LE(ZIP64_VERSION, 12);
  end.writeUInt16LE(ZIP64_VERSION, 14);
  end.writeBigUInt64LE(BigInt(count), 24);
  end.writeBigUInt64LE(BigInt(count), 32);
  end.writeBigUInt64LE(BigInt(size), 40);
  end.writeBigUInt64LE(BigInt(offset), 48);
  return end;
};

const zip64Locator = (endOffset: number): Buffer => {
  const locator = Buffer.alloc(ZIP64_LOCATOR_SIZE);
  locator.writeUInt32LE(ZIP64_LOCATOR_SIGNATURE, 0);
  locator.writeBigUInt64LE(BigInt(endOffset), 8);
  locator.writeUInt32LE(1, 16);
  return locator;
};

const classicEnd = (count: number, size: number, offset: number, limits: ZipLimits): Buffer => {
  const entries = count >= limits.count ? MAX_16 : count;
  const end = Buffer.alloc(END_SIZE);
  end.writeUInt32LE(END_SIGNATURE, 0);
  end.writeUInt16LE(entries, 8);
  end.writeUInt16LE(entries, 10);
  end.writeUInt32LE(size >= limits.bytes ? MAX_32 : size, 12);
  end.writeUInt32LE(offset >= limits.bytes ? MAX_32 : offset, 16);
  return end;
};

const endRecord = (count: number, size: number, offset: number, limits: ZipLimits = ZIP64_LIMITS): Buffer => {
  const wide = count >= limits.count || size >= limits.bytes || offset >= limits.bytes;
  const tail = classicEnd(count, size, offset, limits);
  if (!wide) return tail;
  return Buffer.concat([zip64End(count, size, offset), zip64Locator(offset + size), tail]);
};

export { endRecord };
