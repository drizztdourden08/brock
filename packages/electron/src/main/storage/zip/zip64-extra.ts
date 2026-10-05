/* @layer electron-main @kind logic */
import { ZIP64_EXTRA_HEAD, ZIP64_EXTRA_ID, ZIP64_FIELD } from './zip.constants';

const zip64Extra = (values: readonly number[]): Buffer => {
  if (values.length === 0) return Buffer.alloc(0);
  const extra = Buffer.alloc(ZIP64_EXTRA_HEAD + values.length * ZIP64_FIELD);
  extra.writeUInt16LE(ZIP64_EXTRA_ID, 0);
  extra.writeUInt16LE(values.length * ZIP64_FIELD, 2);
  values.forEach((value, index) => extra.writeBigUInt64LE(BigInt(value), ZIP64_EXTRA_HEAD + index * ZIP64_FIELD));
  return extra;
};

export { zip64Extra };
