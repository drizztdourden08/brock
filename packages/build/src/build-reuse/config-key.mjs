/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { DEV_MODE } from './build-reuse.constants.mjs';
import { configImportStamps } from './config-imports.mjs';
import { contentOf } from './file-stamp.mjs';

const CONFIG_ENTRIES = ['brock.config.ts', 'electron.vite.config.ts'];
const VITE_ENV = /^(?:MAIN_|PRELOAD_|RENDERER_)?VITE_/;

const envFilesOf = (mode) => ['.env', '.env.local', `.env.${mode}`, `.env.${mode}.local`];

const envFileParts = (envDir, mode) => envFilesOf(mode).map((name) => `${join(envDir, name)}=${contentOf(join(envDir, name))}`);

const importContents = (rootDir) => Object.fromEntries(Object.keys(configImportStamps(rootDir, CONFIG_ENTRIES)).map((file) => [file, contentOf(file)]));

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
    envFiles: envDir ? envFileParts(envDir, config.mode) : [],
    imports: importContents(rootDir),
  };
};

/**
 * @param {string} rootDir the app root
 * @returns {Record<string, unknown>} what decides the config of a dev build, read without Vite
 */
const preflightConfig = (rootDir) => ({
  mode: DEV_MODE,
  env: Object.entries(process.env).filter(([name]) => VITE_ENV.test(name)).sort(([a], [b]) => a.localeCompare(b)),
  envFiles: envFileParts(rootDir, DEV_MODE),
  imports: importContents(rootDir),
});

export { configKey, preflightConfig };
