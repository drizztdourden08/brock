/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { longHex } from './long-hex.mjs';
import { TESSERA_TOKENS_JSON } from './look.constants.mjs';

const readTokens = (tesseraRoot) => {
  const file = join(tesseraRoot, TESSERA_TOKENS_JSON);
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
};

const dimOf = (tokens, brand) => [tokens.palettes?.[brand]?.dark?.textDim, tokens.theme.dark.textDim].map(longHex).find(Boolean);

/**
 * @param {string} tesseraRoot  The installed Tessera package folder
 * @param {string} [brand]  Its palette sets the dim text
 * @returns {import('@drizztdourden08/brock-core/look').LookInks | undefined}
 */
const readLookInks = (tesseraRoot, brand) => {
  const tokens = readTokens(tesseraRoot);
  const light = longHex(tokens?.theme?.dark?.text);
  const ground = longHex(tokens?.theme?.dark?.bg);
  if (!light || !ground) return undefined;
  const dim = dimOf(tokens, brand);
  return { light, dark: ground, ...(dim ? { dim } : {}) };
};

export { readLookInks };
