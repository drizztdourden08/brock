/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { SMC_HEADER_SIZE } from '../snes.constants.mjs';

const romBytes = (file) => {
  const bytes = readFileSync(file);
  return (bytes.length & 0xfffff) === SMC_HEADER_SIZE ? bytes.subarray(SMC_HEADER_SIZE) : bytes;
};

/**
 * @param {string} file
 * @param {Record<string, string>} known sha1 to label
 * @returns {{ hash: string, label: string | null }}
 */
const checkRom = (file, known) => {
  const hash = createHash('sha1').update(romBytes(file)).digest('hex').toUpperCase();
  return { hash, label: known[hash] ?? null };
};

export { checkRom };
