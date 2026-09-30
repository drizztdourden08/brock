/* @layer tooling-scripts @kind constants */
const WEB_TEMPLATES = import.meta.dirname;
const WEB_VITE_CONFIG_FILE = 'vite.web.config.ts';
const WEB_OUT_DIR = 'dist/web';
const WEB_SCRIPTS = Object.freeze({ 'build:web': 'brock web build', 'dev:web': 'brock web dev' });
const MANIFEST_FILE = 'manifest.webmanifest';
const DEFAULT_BACKGROUND = '#0f0f12';

const MANIFEST_ICONS = [
  { from: 'public/logos/icon-256.png', to: 'logos/icon-256.png', sizes: '256x256', purpose: 'any', public: true },
  { from: 'build/icons/png/icon-512.png', to: 'icons/icon-512.png', sizes: '512x512', purpose: 'any', public: false },
  { from: 'build/icons/maskable-512.png', to: 'icons/maskable-512.png', sizes: '512x512', purpose: 'maskable', public: false },
];

export { WEB_TEMPLATES, WEB_VITE_CONFIG_FILE, WEB_OUT_DIR, WEB_SCRIPTS, MANIFEST_FILE, DEFAULT_BACKGROUND, MANIFEST_ICONS };
