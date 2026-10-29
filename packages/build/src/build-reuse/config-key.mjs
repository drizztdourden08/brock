/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { configImportStamps } from './config-imports.mjs';
import { contentOf } from './file-stamp.mjs';

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
    envFiles: envDir ? envFilesOf(config.mode).map((name) => `${join(envDir, name)}=${contentOf(join(envDir, name))}`) : [],
    imports: Object.fromEntries(Object.keys(configImportStamps(rootDir, CONFIG_ENTRIES)).map((file) => [file, contentOf(file)])),
  };
};

export { configKey };
