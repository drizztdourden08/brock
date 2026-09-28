/* @layer tooling-scripts @kind config */
const TESSERA_PACKAGE = '@drizztdourden08/tessera';
const ICON_SIZES = [16, 24, 32, 48, 64, 128, 256, 512, 1024];

/**
 * @typedef {{ from: string, to: string }} BrandFile  Paths relative to brand/<brand>/ and the app root
 */

/** @type {BrandFile[]} */
const BRAND_FILES = [
  { from: 'icon/icon.ico', to: 'build/icons/icon.ico' },
  { from: 'icon/png/icon-1024.png', to: 'build/icons/icon.png' },
  ...ICON_SIZES.map((size) => ({ from: `icon/png/icon-${size}.png`, to: `build/icons/png/icon-${size}.png` })),
  { from: 'icon/maskable-512.png', to: 'build/icons/maskable-512.png' },
  { from: 'icon/android/icon-foreground.png', to: 'build/icons/android/icon-foreground.png' },
  { from: 'icon/android/icon-background.png', to: 'build/icons/android/icon-background.png' },
  { from: 'splash/splash-2732.png', to: 'build/splash/splash-2732.png' },
  { from: 'splash/splash.svg', to: 'build/splash/splash.svg' },
  { from: 'icon/icon.svg', to: 'public/logos/icon.svg' },
  { from: 'icon/png/icon-256.png', to: 'public/logos/icon-256.png' },
];

export { TESSERA_PACKAGE, BRAND_FILES };
