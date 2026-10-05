/* @layer tooling-scripts @kind logic */
import { FAMILY_NAME_IDS, WINDOWS_PLATFORM } from './woff2.constants.mjs';

/**
 * @param {Buffer} ttf
 * @returns {Buffer | null}  the name table
 */
const nameTable = (ttf) => {
  const count = ttf.readUInt16BE(4);
  for (let index = 0; index < count; index += 1) {
    const record = 12 + index * 16;
    if (ttf.toString('latin1', record, record + 4) === 'name') {
      const offset = ttf.readUInt32BE(record + 8);
      return ttf.subarray(offset, offset + ttf.readUInt32BE(record + 12));
    }
  }
  return null;
};

/**
 * @param {Buffer} utf16  big endian
 * @returns {string}
 */
const fromUtf16be = (utf16) => Buffer.from(utf16).swap16().toString('utf16le');

/**
 * @param {Buffer} ttf  a TrueType file
 * @returns {string | null}  the typographic family, else the family (Windows names)
 */
const fontFamily = (ttf) => {
  const names = nameTable(ttf);
  if (!names) return null;
  const strings = names.readUInt16BE(4);
  const records = Array.from({ length: names.readUInt16BE(2) }, (_, index) => {
    const at = 6 + index * 12;
    return { platform: names.readUInt16BE(at), id: names.readUInt16BE(at + 6), length: names.readUInt16BE(at + 8), offset: names.readUInt16BE(at + 10) };
  });
  const record = FAMILY_NAME_IDS.map((id) => records.find((entry) => entry.platform === WINDOWS_PLATFORM && entry.id === id)).find(Boolean);
  return record ? fromUtf16be(names.subarray(strings + record.offset, strings + record.offset + record.length)) : null;
};

export { fontFamily };
