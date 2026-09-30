/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';

/**
 * @param {string} hex  #rgb or #rrggbb
 * @returns {string}  #rrggbb, lower case
 */
const longHex = (hex) => {
  const digits = hex.slice(1).toLowerCase();
  return `#${digits.length === 3 ? [...digits].map((d) => d + d).join('') : digits}`;
};

/**
 * @param {string} file  A stylesheet that may set palette seeds
 * @param {string} name  A custom property such as --p-primary
 * @returns {string | null}  The first hex value it is given, or null
 */
const readPaletteSeed = (file, name) => {
  if (!existsSync(file)) return null;
  const pattern = new RegExp(String.raw`${name}\s*:\s*(#[0-9a-f]{6}|#[0-9a-f]{3})\b`, 'i');
  const match = pattern.exec(readFileSync(file, 'utf8'));
  return match ? longHex(match[1]) : null;
};

export { readPaletteSeed };
