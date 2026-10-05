/* @layer tooling-scripts @kind logic */
import { LOWEST_U_CODE, ONE_MORE_BYTE_CODE_1, ONE_MORE_BYTE_CODE_2, WORD_CODE } from './woff2.constants.mjs';

/**
 * @typedef {object} ByteReader
 * @property {() => number} u8 @property {() => number} u16 @property {() => number} i16 @property {() => number} u32
 * @property {() => number} base128  UIntBase128
 * @property {() => number} u255  255UInt16
 * @property {(length: number) => Buffer} bytes
 * @property {() => number} offset
 */

/**
 * @param {Buffer} buffer
 * @returns {ByteReader}  reads the buffer front to back, big endian
 */
const byteReader = (buffer) => {
  let at = 0;
  const take = (length, read) => {
    if (at + length > buffer.length) throw new Error('WOFF2 data ends early');
    const value = read(at);
    at += length;
    return value;
  };
  const u8 = () => take(1, (from) => buffer.readUInt8(from));
  const u16 = () => take(2, (from) => buffer.readUInt16BE(from));
  const base128 = () => {
    let value = 0;
    for (let index = 0; index < 5; index += 1) {
      const byte = u8();
      value = value * 128 + (byte & 0x7f);
      if (!(byte & 0x80)) return value;
    }
    throw new Error('WOFF2 UIntBase128 runs past 5 bytes');
  };
  const u255 = () => {
    const code = u8();
    if (code === WORD_CODE) return u16();
    if (code === ONE_MORE_BYTE_CODE_1) return u8() + LOWEST_U_CODE;
    if (code === ONE_MORE_BYTE_CODE_2) return u8() + LOWEST_U_CODE * 2;
    return code;
  };
  return {
    u8,
    u16,
    i16: () => take(2, (from) => buffer.readInt16BE(from)),
    u32: () => take(4, (from) => buffer.readUInt32BE(from)),
    base128,
    u255,
    bytes: (length) => take(length, (from) => buffer.subarray(from, from + length)),
    offset: () => at,
  };
};

export { byteReader };
