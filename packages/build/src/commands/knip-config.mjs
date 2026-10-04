/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { appDirs } from './app-dirs.mjs';
import { THREAD } from './workspace-config.mjs';

const KNIP_BASE = JSON.parse(readFileSync(createRequire(import.meta.url).resolve('@drizztdourden08/standards/knip/base.json'), 'utf8'));

const APP_WORKSPACE = {
  entry: ['electron/main.ts', 'electron/preload.ts', 'src/main.tsx', 'src/screens/**/*.custom.tsx', '.brock/*.ts', '*.config.{cjs,ts,mjs}', '.markdownlint-cli2.mjs', 'brock.config.ts', 'brock.workspace.mjs'],
  project: ['src/**/*.{ts,tsx}', 'electron/**/*.ts', '.brock/*.ts'],
  ignoreDependencies: ['@electron-toolkit/utils', 'zustand'],
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
    entry: ['brock.workspace.mjs'],
    ignoreDependencies: linked ? [THREAD] : [],
  };
  if (apps.length > 0) config.workspaces = Object.fromEntries(apps.map((dir) => [dir, APP_WORKSPACE]));
  return `${JSON.stringify(config, null, 2)}\n`;
};

export { knipJson };
