/* @layer tooling-scripts @kind logic */

/**
 * @param {Buffer} data  padded to 4 bytes
 * @returns {number}  the sfnt table checksum
 */
const checksum = (data) => {
  let sum = 0;
  for (let at = 0; at < data.length; at += 4) sum = (sum + data.readUInt32BE(at)) >>> 0;
  return sum;
};

/**
 * @param {Buffer} data
 * @returns {Buffer}  the table, padded to 4 bytes
 */
const padded = (data) => Buffer.concat([data, Buffer.alloc((4 - (data.length % 4)) % 4)]);

/**
 * @param {number} numTables
 * @returns {Buffer}  the offset table's search fields
 */
const searchFields = (numTables) => {
  const power = 2 ** Math.floor(Math.log2(numTables));
  const out = Buffer.alloc(6);
  out.writeUInt16BE(power * 16, 0);
  out.writeUInt16BE(Math.log2(power), 2);
  out.writeUInt16BE(numTables * 16 - power * 16, 4);
  return out;
};

/**
 * @param {number} flavor  the sfnt version
 * @param {{ tag: string, data: Buffer }[]} tables
 * @returns {Buffer}  a TrueType or OpenType file, its records sorted by tag
 */
const writeSfnt = (flavor, tables) => {
  const sorted = [...tables].sort((a, b) => (a.tag < b.tag ? -1 : 1));
  const head = Buffer.alloc(6);
  head.writeUInt32BE(flavor, 0);
  head.writeUInt16BE(sorted.length, 4);
  const records = Buffer.alloc(16 * sorted.length);
  let offset = 12 + records.length;
  const bodies = sorted.map(({ tag, data }, index) => {
    const body = padded(data);
    records.write(tag, index * 16, 4, 'latin1');
    records.writeUInt32BE(checksum(body), index * 16 + 4);
    records.writeUInt32BE(offset, index * 16 + 8);
    records.writeUInt32BE(data.length, index * 16 + 12);
    offset += body.length;
    return body;
  });
  return Buffer.concat([head, searchFields(sorted.length), records, ...bodies]);
};

export { writeSfnt };
