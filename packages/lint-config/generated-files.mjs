/* @layer tooling-scripts @kind logic */
import { closeSync, existsSync, openSync, readSync } from 'node:fs';
import { join } from 'node:path';
import { GENERATED_FILES, GENERATED_HEADER_BYTES } from './generated-files.constants.mjs';

const headOf = (file) => {
  const fd = openSync(file, 'r');
  try {
    const buffer = Buffer.alloc(GENERATED_HEADER_BYTES);
    return buffer.toString('utf8', 0, readSync(fd, buffer, 0, GENERATED_HEADER_BYTES, 0));
  } finally {
    closeSync(fd);
  }
};

const isGenerated = (rootDir, { path, marker }) => {
  const file = join(rootDir, path);
  if (!existsSync(file)) return false;
  return marker === null || marker.test(headOf(file));
};

/**
 * @param {string} rootDir the repo root
 * @returns {string[]} root-relative paths of generated files
 */
const generatedFiles = (rootDir) => GENERATED_FILES.filter((entry) => isGenerated(rootDir, entry)).map(({ path }) => path);

export { generatedFiles };
