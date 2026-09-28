/* @layer core @kind constants */
import type { ProductIcons, ProductLogos, WindowConfig } from './product.type';

const SLUG = /^[a-z0-9][a-z0-9-]{0,62}$/;
const REVERSE_DNS = /^[a-z0-9]+(\.[a-z0-9-]+)+$/i;

const BLACK = '#000000';

const DEFAULT_WINDOW: WindowConfig = {
  defaultSize: { width: 1280, height: 720 },
  minSize: { width: 360, height: 280 },
  backgroundColor: BLACK,
  splash: { width: 480, height: 360 },
};

const BRAND_ICONS: ProductIcons = {
  ico: 'build/icons/icon.ico',
  png256: 'build/icons/png/icon-256.png',
  png512: 'build/icons/png/icon-512.png',
};

const DEFAULT_LOGOS: ProductLogos = {
  app: './logos/icon-256.png',
  instance: './logos/icon-bot.svg',
};

const DEFAULT_HOME_SCREEN = 'settings';

export { SLUG, REVERSE_DNS, DEFAULT_WINDOW, BRAND_ICONS, DEFAULT_LOGOS, DEFAULT_HOME_SCREEN };
