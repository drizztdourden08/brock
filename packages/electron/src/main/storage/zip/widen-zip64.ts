/* @layer electron-main @kind logic */
import { MAX_32, ZIP64_EXTRA_HEAD, ZIP64_EXTRA_ID, ZIP64_FIELD } from './zip.constants';

const zip64Field = (extra: Buffer): Buffer | null => {
  for (let at = 0; at + ZIP64_EXTRA_HEAD <= extra.length;) {
    const id = extra.readUInt16LE(at);
    const length = extra.readUInt16LE(at + 2);
    if (id === ZIP64_EXTRA_ID) return extra.subarray(at + ZIP64_EXTRA_HEAD, at + ZIP64_EXTRA_HEAD + length);
    at += ZIP64_EXTRA_HEAD + length;
  }
  return null;
};

const widenZip64 = (values: readonly number[], extra: Buffer): number[] => {
  const field = zip64Field(extra);
  let next = 0;
  return values.map((value) => {
    if (value !== MAX_32 || field === null || next + ZIP64_FIELD > field.length) return value;
    const wide = Number(field.readBigUInt64LE(next));
    next += ZIP64_FIELD;
    return wide;
  });
};

export { widenZip64 };
