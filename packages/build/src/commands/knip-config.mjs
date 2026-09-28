/* @layer tooling-scripts @kind logic */
import { appDirs } from './app-dirs.mjs';

const SCHEMA = 'https://unpkg.com/knip@5/schema.json';

const APP_WORKSPACE = {
  entry: ['electron/main.ts', 'electron/preload.ts', 'src/main.tsx', '.brock/*.ts', '*.config.{cjs,ts,mjs}', '.markdownlint-cli2.mjs', 'brock.config.ts', 'brock.workspace.mjs'],
  project: ['src/**/*.{ts,tsx}', 'electron/**/*.ts', '.brock/*.ts'],
  ignoreDependencies: ['@electron-toolkit/utils', 'zustand'],
};

/**
 * @param {string} rootDir
 * @returns {string} knip.json content
 */
const knipJson = (rootDir) => {
  const apps = appDirs(rootDir).filter((dir) => dir !== '.');
  const config = { $schema: SCHEMA, entry: ['brock.workspace.mjs'], ignoreDependencies: [] };
  if (apps.length > 0) config.workspaces = Object.fromEntries(apps.map((dir) => [dir, APP_WORKSPACE]));
  return `${JSON.stringify(config, null, 2)}\n`;
};

export { knipJson };
