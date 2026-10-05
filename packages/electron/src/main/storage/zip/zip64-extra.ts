/* @layer electron-main @kind logic */
import { MAX_32, ZIP64_EXTRA_ID } from './zip.constants';

const EXTRA_HEAD = 4;
const FIELD = 8;

const zip64Extra = (values: readonly number[]): Buffer => {
  if (values.length === 0) return Buffer.alloc(0);
  const extra = Buffer.alloc(EXTRA_HEAD + values.length * FIELD);
  extra.writeUInt16LE(ZIP64_EXTRA_ID, 0);
  extra.writeUInt16LE(values.length * FIELD, 2);
  values.forEach((value, index) => extra.writeBigUInt64LE(BigInt(value), EXTRA_HEAD + index * FIELD));
  return extra;
};

const zip64Field = (extra: Buffer): Buffer | null => {
  for (let at = 0; at + EXTRA_HEAD <= extra.length;) {
    const id = extra.readUInt16LE(at);
    const length = extra.readUInt16LE(at + 2);
    if (id === ZIP64_EXTRA_ID) return extra.subarray(at + EXTRA_HEAD, at + EXTRA_HEAD + length);
    at += EXTRA_HEAD + length;
  }
  return null;
};

const widen = (values: readonly number[], extra: Buffer): number[] => {
  const field = zip64Field(extra);
  let next = 0;
  return values.map((value) => {
    if (value !== MAX_32 || field === null || next + FIELD > field.length) return value;
    const wide = Number(field.readBigUInt64LE(next));
    next += FIELD;
    return wide;
  });
};

export { widen, zip64Extra };
