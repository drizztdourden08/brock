/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { LINUX_ICON_DIR } from '../icons/brand-files.mjs';

const BRAND_BUILDER_ICONS = Object.freeze({ win: 'build/icons/icon.ico', mac: 'build/icons/icon.png', linux: LINUX_ICON_DIR });

const PLATFORM_KEYS = Object.freeze({ win32: 'win', darwin: 'mac', linux: 'linux' });

const SIZED_PNG = /^\d+(?:x\d+)?\.png$/i;

/**
 * @param {import('@drizztdourden08/brock-core/product').ProductInput['icons']} icons
 * @returns {{ win?: string, mac?: string, linux?: string }} the icons electron-builder takes, from the app root
 */
const builderIcons = (icons = {}) =>
  icons.brand ? BRAND_BUILDER_ICONS : { win: icons.ico, mac: icons.png512, linux: icons.png256 };

const usable = (path) => {
  if (!existsSync(path)) return false;
  if (!statSync(path).isDirectory()) return true;
  return readdirSync(path).some((name) => SIZED_PNG.test(name));
};

/**
 * @param {string} rootDir the app root
 * @param {import('@drizztdourden08/brock-core/product').ProductInput['icons']} icons
 * @param {NodeJS.Platform} platform
 * @returns {string | null} why the icon would be Electron's, or null
 */
const builderIconProblem = (rootDir, icons, platform) => {
  const key = PLATFORM_KEYS[platform];
  const icon = key ? builderIcons(icons)[key] : undefined;
  if (!key) return null;
  if (!icon) return `product.icons names no ${key} icon, so electron-builder would ship Electron's own. Set icons.brand, or the icon path for ${key}.`;
  if (usable(join(rootDir, icon))) return null;
  const folder = icon === LINUX_ICON_DIR ? ' (a folder of <size>x<size>.png files)' : '';
  return `${icon}${folder} is missing, so electron-builder would ship Electron's own icon. Run brock icons, or check the icon path in product.icons.`;
};

export { builderIconProblem, builderIcons };
