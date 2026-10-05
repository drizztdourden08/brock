/* @layer tooling-scripts @kind logic */
import { brotliDecompressSync } from 'node:zlib';
import { byteReader } from './byte-reader.mjs';
import { COLLECTION_FLAVOR, CUSTOM_TAG, KNOWN_TAGS, WOFF2_HEADER_SIZE, WOFF2_SIGNATURE } from './woff2.constants.mjs';

/**
 * @typedef {{ tag: string, data: Buffer, transformed: boolean }} Woff2Table  data: as stored, transformed or not
 */

/**
 * @param {string} tag @param {number} version
 * @returns {boolean}  glyf and loca transform at version 0, others at any other
 */
const isTransformed = (tag, version) => (tag === 'glyf' || tag === 'loca' ? version === 0 : version !== 0);

/**
 * @param {import('./byte-reader.mjs').ByteReader} reader
 * @returns {{ tag: string, length: number, transformed: boolean }}  one table directory entry
 */
const readEntry = (reader) => {
  const flags = reader.u8();
  const tag = (flags & CUSTOM_TAG) === CUSTOM_TAG ? reader.bytes(4).toString('latin1') : KNOWN_TAGS[flags & CUSTOM_TAG];
  const transformed = isTransformed(tag, flags >> 6);
  const origLength = reader.base128();
  return { tag, length: transformed ? reader.base128() : origLength, transformed };
};

/**
 * @param {Buffer} woff2
 * @returns {{ flavor: number, tables: Woff2Table[] }}  every table, out of the Brotli stream
 */
const woff2Tables = (woff2) => {
  if (woff2.toString('latin1', 0, 4) !== WOFF2_SIGNATURE) throw new Error('not a WOFF2 file');
  const flavor = woff2.readUInt32BE(4);
  if (flavor === COLLECTION_FLAVOR) throw new Error('a WOFF2 font collection is not read');
  const numTables = woff2.readUInt16BE(12);
  const compressedLength = woff2.readUInt32BE(20);
  const reader = byteReader(woff2.subarray(WOFF2_HEADER_SIZE));
  const entries = Array.from({ length: numTables }, () => readEntry(reader));
  const start = WOFF2_HEADER_SIZE + reader.offset();
  const stream = brotliDecompressSync(woff2.subarray(start, start + compressedLength));
  let at = 0;
  const tables = entries.map(({ tag, length, transformed }) => {
    const data = stream.subarray(at, at + length);
    at += length;
    return { tag, data, transformed };
  });
  return { flavor, tables };
};

export { woff2Tables };
