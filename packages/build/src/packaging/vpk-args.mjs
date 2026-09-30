/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { NO_SHORTCUTS, SHORTCUT_LOCATIONS } from '../installer/installer.constants.mjs';

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
 * @property {VpkExtras} [extras]
 */

/**
 * @typedef {object} VpkExtras
 * @property {string | null} [splash] @property {string | null} [accent]
 * @property {string | null} [notes] @property {string | null} [channel]
 * @property {boolean} [full]
 * @property {import('@drizztdourden08/brock-core/product').InstallerConfig} [installer]
 */

/**
 * @param {string} flag
 * @param {string | null | undefined} value
 */
const optional = (flag, value) => (value ? [flag, value] : []);

/**
 * @param {import('@drizztdourden08/brock-core/product').InstallerShortcuts} shortcuts
 * @returns {string}  vpk's --shortcuts list
 */
const shortcutsOf = (shortcuts) => {
  const places = Object.entries(SHORTCUT_LOCATIONS).filter(([key]) => shortcuts[key]).map(([, place]) => place);
  return places.length ? places.join(',') : NO_SHORTCUTS;
};

/**
 * @param {VpkExtras} extras
 * @returns {string[]}
 */
const windowsArgs = ({ splash, accent, full, installer }) => [
  ...optional('--splashImage', splash),
  ...optional('--splashProgressColor', accent),
  ...optional('--shortcuts', installer && shortcutsOf(installer.shortcuts)),
  ...optional('--instLicense', installer?.licence),
  ...(full ? [] : ['--noInst']),
];

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
