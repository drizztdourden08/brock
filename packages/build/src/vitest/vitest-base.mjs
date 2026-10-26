/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { appAliases } from '../build-options/app-aliases.mjs';
import { CONFIG_FILE } from '../config.mjs';
import { loadBrockConfig } from '../load-config.mjs';
import { ESBUILD_JSX, INLINED_SOURCE, SHARED_PACKAGES } from './vitest.constants.mjs';

/**
 * @param {string} rootDir the app root
 * @returns {Promise<Record<string, string>>} the app aliases, none without brock.config.ts
 */
const aliasesOf = async (rootDir) => {
  if (!existsSync(join(rootDir, CONFIG_FILE))) return {};
  const { build } = await loadBrockConfig(rootDir);
  return appAliases(rootDir, build);
};

/**
 * @param {string} rootDir the app root
 * @returns {Promise<Record<string, unknown>>} the config every Brock app tests with
 */
const vitestBase = async (rootDir) => ({
  esbuild: { ...ESBUILD_JSX },
  resolve: { alias: await aliasesOf(rootDir), dedupe: SHARED_PACKAGES },
  test: { server: { deps: { inline: [INLINED_SOURCE] } } },
});

export { vitestBase };
