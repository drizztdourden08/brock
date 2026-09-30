/* @layer tooling-scripts @kind logic */
import { appDirs } from './app-dirs.mjs';
import { THREAD } from './workspace-config.mjs';

const SCHEMA = 'https://unpkg.com/knip@5/schema.json';

const APP_WORKSPACE = {
  entry: ['electron/main.ts', 'electron/preload.ts', 'src/main.tsx', '.brock/*.ts', '*.config.{cjs,ts,mjs}', '.markdownlint-cli2.mjs', 'brock.config.ts', 'brock.workspace.mjs'],
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
    $schema: SCHEMA,
    entry: ['brock.workspace.mjs'],
    ignore: ['.worktrees/**'],
    ignoreDependencies: linked ? [THREAD] : [],
  };
  if (apps.length > 0) config.workspaces = Object.fromEntries(apps.map((dir) => [dir, APP_WORKSPACE]));
  return `${JSON.stringify(config, null, 2)}\n`;
};

export { knipJson };
