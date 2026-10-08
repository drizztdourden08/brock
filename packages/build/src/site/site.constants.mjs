/* @layer tooling-scripts @kind constants */
const SITE_CONFIG_FILE = 'brock.site.ts';
const SITE_VITE_CONFIG_FILE = 'vite.config.ts';
const SITE_TSCONFIG_FILE = 'tsconfig.json';
const SITE_OUT_DIR = 'dist';
const SITES_DIR = 'apps';
const SITES_GLOB = 'apps/*';
const DEFAULT_API_PATH = '/api';
const DEFAULT_SITE_BRAND = 'brock';
const SITE_NAME_RULE = /^[a-z][a-z0-9-]{0,30}$/;
const SITE_TEMPLATE_DIR = new URL('./template/', import.meta.url);
const SITE_FAVICON_PATH = '/brock-site/icon.svg';
const SITE_MODES = new Set(['dev', 'build', 'preview']);
const NODE_POLYFILLS_PACKAGE = 'vite-plugin-node-polyfills';

const SITE_PACKAGES = Object.freeze({
  dependencies: ['@drizztdourden08/tessera', 'react', 'react-dom'],
  devDependencies: ['@drizztdourden08/brock-build', '@types/node', '@types/react', '@types/react-dom', '@vitejs/plugin-react', 'typescript', 'vite'],
});

const SITE_SCRIPTS = Object.freeze({
  dev: 'brock site dev',
  build: 'brock site build',
  preview: 'brock site preview',
  typecheck: 'tsc --noEmit',
  lint: 'tsc --noEmit && eslint . && stylelint "src/**/*.css"',
});

const SITE_USAGE = [
  'brock site add <name> [--brand <brand>] [--api <url | port offset>]',
  '                           a web app (a Vite SPA on Tessera) at apps/<name> of this repo, beside the Brock app',
  'brock site dev | build | preview [args]',
  '                           run in a site folder: Vite on its port, its build into dist, or a preview of the build',
  'brock site list            the sites of this repo, their ports and their /api target',
].join('\n');

export {
  SITE_CONFIG_FILE, SITE_VITE_CONFIG_FILE, SITE_TSCONFIG_FILE, SITE_OUT_DIR, SITES_DIR, SITES_GLOB, DEFAULT_API_PATH, DEFAULT_SITE_BRAND,
  SITE_NAME_RULE, SITE_TEMPLATE_DIR, SITE_FAVICON_PATH, SITE_MODES, NODE_POLYFILLS_PACKAGE, SITE_PACKAGES, SITE_SCRIPTS, SITE_USAGE,
};
