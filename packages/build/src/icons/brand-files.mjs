/* @layer tooling-scripts @kind config */
const TESSERA_PACKAGE = '@drizztdourden08/tessera';
const BRAND_DIR = 'brand';
const DARK_GROUND_DIR = 'dark-ground';
const BRAND_RIMS = Object.freeze({ brock: 'light' });
const ICON_SIZES = [16, 24, 32, 48, 64, 128, 256, 512, 1024];
const LINUX_ICON_DIR = 'build/icons/linux';

/**
 * @typedef {{ from: string, to: string }} BrandFile  Paths relative to the brand folder and the app root
 */

/** @type {BrandFile[]} */
const BRAND_FILES = [
  { from: 'icon/icon.ico', to: 'build/icons/icon.ico' },
  { from: 'icon/png/icon-1024.png', to: 'build/icons/icon.png' },
  ...ICON_SIZES.map((size) => ({ from: `icon/png/icon-${size}.png`, to: `build/icons/png/icon-${size}.png` })),
  ...ICON_SIZES.map((size) => ({ from: `icon/png/icon-${size}.png`, to: `${LINUX_ICON_DIR}/${size}x${size}.png` })),
  { from: 'icon/maskable-512.png', to: 'build/icons/maskable-512.png' },
  { from: 'icon/android/icon-foreground.png', to: 'build/icons/android/icon-foreground.png' },
  { from: 'icon/android/icon-background.png', to: 'build/icons/android/icon-background.png' },
  { from: 'splash/splash-2732.png', to: 'build/splash/splash-2732.png' },
  { from: 'splash/splash.svg', to: 'build/splash/splash.svg' },
  { from: 'icon/icon.svg', to: 'public/logos/icon.svg' },
  { from: 'icon/icon.ico', to: 'public/logos/icon.ico' },
  { from: 'icon/png/icon-256.png', to: 'public/logos/icon-256.png' },
  { from: 'icon/png/icon-32.png', to: 'public/logos/icon-32.png' },
  { from: 'icon/png/icon-24.png', to: 'public/logos/icon-24.png' },
];

/**
 * @param {string} brand
 * @returns {BrandFile}  The dark ground mark, in brand/dark-ground
 */
const markFile = (brand) => ({ from: `${brand}.svg`, to: 'public/logos/mark.svg' });

export { TESSERA_PACKAGE, BRAND_DIR, DARK_GROUND_DIR, BRAND_RIMS, BRAND_FILES, LINUX_ICON_DIR, markFile };
