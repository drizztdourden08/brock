/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { PUBLIC_DIR } from './installer.constants.mjs';
import { readImage } from './read-image.mjs';

/**
 * @param {string} rootDir  The app root
 * @param {import('@drizztdourden08/brock-core/product').ProductConfig} config
 * @returns {import('./read-image.mjs').ImageSource | null}  the dark wordmark, null without one
 */
const wordmarkSourceOf = (rootDir, config) => {
  const wordmark = config.icons?.wordmark;
  if (!wordmark) return null;
  const source = readImage(rootDir, join(PUBLIC_DIR, wordmark.dark));
  if (!source) throw new Error(`product.icons.wordmark names ${wordmark.dark}, which is not under public/`);
  return source;
};

export { wordmarkSourceOf };
