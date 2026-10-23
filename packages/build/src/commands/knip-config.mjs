/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { appDirs } from './app-dirs.mjs';
import { USAGE_ENTRY } from './knip.constants.mjs';
import { THREAD } from './workspace-config.mjs';

const KNIP_BASE = JSON.parse(readFileSync(createRequire(import.meta.url).resolve('@drizztdourden08/standards/knip/base.json'), 'utf8'));

const APP_WORKSPACE = {
  entry: ['electron/main.ts', 'electron/preload.ts', 'src/main.tsx', 'src/ipc/contract.type.ts', 'src/screens/**/*.custom.tsx', USAGE_ENTRY, '.brock/*.ts', '*.config.{cjs,ts,mjs}', 'brock.config.ts'],
  project: ['src/**/*.{ts,tsx}', 'electron/**/*.ts', '.brock/*.ts'],
};

const ROOT_WORKSPACE = {
  entry: ['.markdownlint-cli2.mjs', 'brock.workspace.mjs', 'eslint.config.mjs', 'stylelint.config.mjs'],
  project: ['*.{mjs,ts}'],
  ignoreBinaries: ['eslint', 'stylelint', 'markdownlint-cli2'],
};

/**
 * @param {string} rootDir
 * @param {{ linked?: boolean }} [options] linked: Brock comes through link: specs
 * @returns {string} knip.json content
 */
const knipJson = (rootDir, { linked = false } = {}) => {
  const apps = appDirs(rootDir).filter((dir) => dir !== '.');
  const config = {
    ...KNIP_BASE,
    ignoreDependencies: linked ? [THREAD] : [],
  };
  if (apps.length === 0) config.entry = ['brock.workspace.mjs'];
  else config.workspaces = { '.': ROOT_WORKSPACE, ...Object.fromEntries(apps.map((dir) => [dir, APP_WORKSPACE])) };
  return `${JSON.stringify(config, null, 2)}\n`;
};

export { knipJson };
