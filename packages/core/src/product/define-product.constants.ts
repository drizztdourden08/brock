/* @layer core @kind constants */
import type { InstallerConfig, InstallScope, ProductIcons, ProductLogos, WindowConfig } from './product.type';

const SLUG = /^[a-z0-9][a-z0-9-]{0,62}$/;
const REVERSE_DNS = /^[a-z0-9]+(\.[a-z0-9-]+)+$/i;
const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const PORT_BASE_MIN = 1024;
const PORT_BASE_MAX = 65335;

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
  mark: './logos/mark.svg',
};

const DEFAULT_HOME_SCREEN = 'settings';

const DEFAULT_INSTALLER: Omit<InstallerConfig, 'folderName'> = {
  scope: 'user',
  shortcuts: { desktop: true, startMenu: true },
  launchAfterInstall: true,
};

const INSTALL_SCOPES: InstallScope[] = ['user', 'machine'];
const LICENCE_FILE = /\.(?:md|txt)$/i;
const UNSAFE_FILE_CHARS = /[/\\?%*:|"<>\p{Cc}]/gu;

export {
  SLUG, REVERSE_DNS, HEX_COLOR, PORT_BASE_MIN, PORT_BASE_MAX, DEFAULT_WINDOW, BRAND_ICONS, DEFAULT_LOGOS, DEFAULT_HOME_SCREEN,
  DEFAULT_INSTALLER, INSTALL_SCOPES, LICENCE_FILE, UNSAFE_FILE_CHARS,
};
