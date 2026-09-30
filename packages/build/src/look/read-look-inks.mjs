/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { TESSERA_TOKENS_JSON } from './look.constants.mjs';

const isHex = (value) => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);

/**
 * @param {string} tesseraRoot  The installed Tessera package folder
 * @returns {import('@drizztdourden08/brock-core/look').LookInks | undefined}
 */
const readLookInks = (tesseraRoot) => {
  const file = join(tesseraRoot, TESSERA_TOKENS_JSON);
  if (!existsSync(file)) return undefined;
  const dark = JSON.parse(readFileSync(file, 'utf8'))?.theme?.dark;
  return isHex(dark?.text) && isHex(dark?.bg) ? { light: dark.text, dark: dark.bg } : undefined;
};

export { readLookInks };
