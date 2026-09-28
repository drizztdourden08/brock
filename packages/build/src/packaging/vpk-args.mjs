/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';

const UNSAFE_FILE_CHARS = /[/\\?%*:|"<>\p{Cc}]/gu;

/**
 * @param {string} name
 */
const productFilename = (name) => name.replace(UNSAFE_FILE_CHARS, '');

/**
 * @param {import('@drizztdourden08/brock-core/product').ProductInput} product
 * @param {string} platform
 */
const mainExeOf = (product, platform) => (platform === 'win32' ? `${productFilename(product.name)}.exe` : product.id);

/**
 * @param {import('@drizztdourden08/brock-core/product').ProductInput} product
 * @param {string} platform
 * @returns {string | null}
 */
const packIconOf = (product, platform) => {
  const icons = product.icons ?? {};
  if (platform === 'win32') return icons.brand ? join('build', 'icons', 'icon.ico') : (icons.ico ?? null);
  return icons.brand ? join('build', 'icons', 'png', 'icon-256.png') : (icons.png256 ?? null);
};

/**
 * @typedef {object} VpkPackInput
 * @property {import('@drizztdourden08/brock-core/product').ProductInput} product
 * @property {string} version
 * @property {string} platform
 * @property {string} packDir
 * @property {string} outputDir
 * @property {{ splash?: string | null, accent?: string | null, notes?: string | null, channel?: string | null, full?: boolean }} [extras]
 */

/**
 * @param {{ splash?: string | null, accent?: string | null, full?: boolean }} extras
 * @returns {string[]}
 */
const windowsArgs = ({ splash, accent, full }) => [
  ...(splash ? ['--splashImage', splash] : []),
  ...(accent ? ['--splashProgressColor', accent] : []),
  ...(full ? [] : ['--noInst']),
];

/**
 * @param {string} flag
 * @param {string | null | undefined} value
 */
const optional = (flag, value) => (value ? [flag, value] : []);

/**
 * @param {VpkPackInput} input
 * @returns {string[]}
 */
const vpkPackArgs = ({ product, version, platform, packDir, outputDir, extras = {} }) => [
  'pack', '--packId', product.id, '--packVersion', version, '--packTitle', product.name,
  '--packAuthors', product.author.name, '--packDir', packDir, '--mainExe', mainExeOf(product, platform),
  '--outputDir', outputDir,
  ...optional('--icon', packIconOf(product, platform)),
  ...(platform === 'win32' ? windowsArgs(extras) : []),
  ...optional('--releaseNotes', extras.notes),
  ...optional('--channel', extras.channel),
];

export { vpkPackArgs, mainExeOf, packIconOf };
