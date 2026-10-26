/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { appAliases } from '../build-options/app-aliases.mjs';
import { CONFIG_FILE } from '../config.mjs';
import { loadBrockConfig } from '../load-config.mjs';
import { appPackagesPlugin } from './app-packages-plugin.mjs';
import { installedFrom } from './installed-from.mjs';
import { ESBUILD_JSX, INLINED_SOURCE, SHARED_PACKAGES } from './vitest.constants.mjs';

/**
 * @param {string} appDir the app folder
 * @returns {Promise<Record<string, string>>} the app aliases, none without brock.config.ts
 */
const aliasesOf = async (appDir) => {
  if (!existsSync(join(appDir, CONFIG_FILE))) return {};
  const { build } = await loadBrockConfig(appDir);
  return appAliases(appDir, build);
};

/**
 * @param {string} rootDir the folder vite runs in
 * @param {string} appDir the folder that holds react and the other shared packages
 * @returns {Pick<import('vite').UserConfig, 'plugins' | 'resolve'>} the shared packages the app has, taken from the app
 */
const sharedPackages = (rootDir, appDir) => {
  const names = SHARED_PACKAGES.filter((name) => installedFrom(appDir, name));
  return appDir === rootDir ? { resolve: { dedupe: names } } : { plugins: [appPackagesPlugin(appDir, names)] };
};

/**
 * @param {string} rootDir the folder vite runs in
 * @param {string} appDir the app folder, rootDir for a single app
 * @returns {Promise<Record<string, unknown>>} the config every Brock app tests with
 */
const vitestBase = async (rootDir, appDir) => {
  const { plugins, resolve } = sharedPackages(rootDir, appDir);
  return {
    esbuild: { ...ESBUILD_JSX },
    plugins,
    resolve: { alias: await aliasesOf(appDir), ...resolve },
    test: { server: { deps: { inline: [INLINED_SOURCE] } } },
  };
};

export { vitestBase };
