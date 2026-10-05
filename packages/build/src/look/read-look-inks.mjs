/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { TESSERA_TOKENS_JSON } from './look.constants.mjs';

const isHex = (value) => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);

const readTokens = (tesseraRoot) => {
  const file = join(tesseraRoot, TESSERA_TOKENS_JSON);
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
};

const dimOf = (tokens, brand) => [tokens.palettes?.[brand]?.dark?.textDim, tokens.theme.dark.textDim].find(isHex);

/**
 * @param {string} tesseraRoot  The installed Tessera package folder
 * @param {string} [brand]  Its palette sets the dim text
 * @returns {import('@drizztdourden08/brock-core/look').LookInks | undefined}
 */
const readLookInks = (tesseraRoot, brand) => {
  const tokens = readTokens(tesseraRoot);
  const dark = tokens?.theme?.dark;
  if (!isHex(dark?.text) || !isHex(dark?.bg)) return undefined;
  const dim = dimOf(tokens, brand);
  return { light: dark.text, dark: dark.bg, ...(dim ? { dim } : {}) };
};

export { readLookInks };
