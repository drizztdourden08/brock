/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { configImportStamps } from './config-imports.mjs';
import { stampOf } from './file-stamp.mjs';

const CONFIG_ENTRIES = ['brock.config.ts', 'electron.vite.config.ts'];

const envFilesOf = (mode) => ['.env', '.env.local', `.env.${mode}`, `.env.${mode}.local`];

/**
 * @param {import('vite').ResolvedConfig} config the resolved config of one bundle
 * @param {string} rootDir the app root
 * @returns {Record<string, unknown>} the config inputs of the output
 */
const configKey = (config, rootDir) => {
  const { sourcemap, minify, target, outDir } = config.build;
  const envDir = typeof config.envDir === 'string' ? config.envDir : null;
  return {
    mode: config.mode,
    nodeEnv: process.env.NODE_ENV ?? null,
    env: config.env,
    define: config.define,
    build: { sourcemap, minify, target, outDir },
    envFiles: envDir ? envFilesOf(config.mode).map((name) => `${join(envDir, name)}=${stampOf(join(envDir, name))}`) : [],
    imports: configImportStamps(rootDir, CONFIG_ENTRIES),
  };
};

export { configKey };
