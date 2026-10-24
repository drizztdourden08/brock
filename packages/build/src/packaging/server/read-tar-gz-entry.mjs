/* @layer tooling-scripts @kind logic */
import { gunzipSync } from 'node:zlib';
import { TAR_BLOCK } from './server-packaging.constants.mjs';

const textAt = (block, from, length) => block.toString('utf8', from, from + length).split('\0')[0];

const nameOf = (block) => {
  const prefix = textAt(block, 345, 155);
  const name = textAt(block, 0, 100);
  return prefix ? `${prefix}/${name}` : name;
};

/**
 * @param {Buffer} archive a gzip-compressed tar
 * @param {(name: string) => boolean} wanted picks the entry by its path
 * @returns {Buffer | null} the file's bytes, or null when no regular file matches
 */
const readTarGzEntry = (archive, wanted) => {
  const tar = gunzipSync(archive);
  let at = 0;
  while (at + TAR_BLOCK <= tar.length) {
    const block = tar.subarray(at, at + TAR_BLOCK);
    if (block.every((byte) => byte === 0)) return null;
    const size = parseInt(textAt(block, 124, 12).trim() || '0', 8);
    const type = textAt(block, 156, 1);
    const start = at + TAR_BLOCK;
    if ((type === '0' || type === '') && wanted(nameOf(block))) return Buffer.from(tar.subarray(start, start + size));
    at = start + Math.ceil(size / TAR_BLOCK) * TAR_BLOCK;
  }
  return null;
};

export { readTarGzEntry };
