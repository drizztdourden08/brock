/* @layer tooling-scripts @kind constants */
const ANDROID_TEMPLATES = import.meta.dirname;

const CAPACITOR_CONFIG_FILE = 'capacitor.config.json';
const CAPACITOR_SCRIPT_CONFIGS = Object.freeze(['capacitor.config.ts', 'capacitor.config.js']);
const ANDROID_PROJECT_DIR = 'mobile/android';
const APP_GRADLE_FILE = 'mobile/android/app/build.gradle';
const ASSETS_DIR = 'mobile/assets';
const CAPACITOR_WEB_DIR = 'dist/web';

const CAPACITOR_DEPENDENCIES = Object.freeze({ '@capacitor/core': '^8.4.0', '@capacitor/android': '^8.4.0' });
const CAPACITOR_DEV_DEPENDENCIES = Object.freeze({ '@capacitor/cli': '^8.4.0', '@capacitor/assets': '^3.0.5' });

const ASSET_SOURCES = [
  { from: 'build/icons/android/icon-foreground.png', to: 'icon-foreground.png' },
  { from: 'build/icons/android/icon-background.png', to: 'icon-background.png' },
  { from: 'build/icons/icon.png', to: 'icon-only.png' },
  { from: 'build/splash/splash-2732.png', to: 'splash.png' },
  { from: 'build/splash/splash-2732.png', to: 'splash-dark.png' },
];

const DEFAULT_ICON_BACKGROUND = '#0f0f12';

const GITIGNORE_LINES = ['mobile/assets/'];
const PROSEIGNORE_LINE = 'mobile/android/**  written by cap add android; the wording is Capacitor\'s';
const JSCPD_IGNORE = 'mobile/android/**';
const BUILT_DEPENDENCY = 'sharp';

const ANDROID_SECRETS = [
  { name: 'ANDROID_KEYSTORE_B64', about: 'the release keystore, base64' },
  { name: 'ANDROID_KEYSTORE_PASSWORD', about: 'its password (store and key)' },
  { name: 'ANDROID_KEY_ALIAS', about: 'the key alias inside it' },
];

export {
  ANDROID_TEMPLATES, CAPACITOR_CONFIG_FILE, CAPACITOR_SCRIPT_CONFIGS, ANDROID_PROJECT_DIR, APP_GRADLE_FILE, ASSETS_DIR, CAPACITOR_WEB_DIR,
  CAPACITOR_DEPENDENCIES, CAPACITOR_DEV_DEPENDENCIES, ASSET_SOURCES, DEFAULT_ICON_BACKGROUND, GITIGNORE_LINES,
  PROSEIGNORE_LINE, JSCPD_IGNORE, BUILT_DEPENDENCY, ANDROID_SECRETS,
};
