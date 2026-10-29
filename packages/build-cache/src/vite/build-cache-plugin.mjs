/* @layer tooling-scripts @kind logic */
import { pathToFileURL } from 'node:url';
import { exportKeyOf } from '../packages/code-exports.mjs';
import { packageBuildKey } from '../packages/compile-package.mjs';
import { DEFAULT_SCOPE } from '../packages/packages.constants.mjs';
import { cacheRoot } from '../store/cache-root.mjs';
import { runtimeImportsOf, serveClosure } from './serve-closure.mjs';

const ES_FORMATS = new Set([undefined, 'es', 'esm', 'module']);
const EMPTY = { served: new Map(), importsOf: new Map(), built: 0 };

const nodeTarget = (target) => {
  if (Array.isArray(target)) return target.join(',');
  return typeof target === 'string' && target !== 'modules' ? target : 'node20';
};

const scopedNameOf = (specifier) => specifier.split('/').slice(0, 2).join('/');

const defaultWhen = (config) => config.command === 'build' && config.mode === 'development' && Boolean(config.build.ssr);

/**
 * @param {Record<string, string> | ((id: string) => string) | undefined} previous the paths option already set
 * @param {Set<string>} used the placed files the build imports
 * @param {boolean} toUrl ESM output, which needs a file URL
 * @returns {(id: string) => string} the output path of each external
 */
const pathsWith = (previous, used, toUrl) => (id) => {
  if (used.has(id)) return toUrl ? pathToFileURL(id).href : id.split('\\').join('/');
  if (typeof previous === 'function') return previous(id);
  return previous?.[id] ?? id;
};

/**
 * @param {{ rootDir: string, scope?: string, root?: string, when?: (config: import('vite').ResolvedConfig) => boolean }} options when: default, a dev SSR build
 * @returns {import('vite').Plugin & { api: { runtimeImports: () => string[] } }} serves installed scoped packages
 */
const buildCachePlugin = ({ rootDir, scope = DEFAULT_SCOPE, root = cacheRoot(), when = defaultWhen }) => {
  let active = false;
  let logger = null;
  let key = null;
  let ready = null;
  let closure = EMPTY;
  const used = new Set();
  const usedKeys = new Set();
  const prepare = async () => {
    closure = await serveClosure({ root, rootDir, scope, key, warn: (line) => logger?.warn(line) });
    const { served, built } = closure;
    if (served.size > 0) logger?.info(`build-cache: ${served.size} package(s) from the machine cache${built ? `, ${built} built now` : ''}`);
  };
  return {
    name: 'build-cache:packages',
    enforce: 'pre',
    api: { runtimeImports: () => runtimeImportsOf(usedKeys, closure) },
    configResolved(config) {
      logger = config.logger;
      active = when(config);
      if (active) key = packageBuildKey({ platform: 'node', target: nodeTarget(config.build.target), define: config.define ?? {} });
    },
    async buildStart() {
      if (!active) return;
      ready ??= prepare().catch((error) => logger?.warn(`build-cache: every package is compiled in: ${error?.message ?? error}`));
      await ready;
    },
    resolveId(source) {
      if (!active || !source.startsWith(scope) || /[?#]/.test(source)) return null;
      const name = scopedNameOf(source);
      const exportKey = exportKeyOf(source, name);
      const file = closure.served.get(name)?.get(exportKey);
      if (!file) return null;
      used.add(file);
      usedKeys.add(`${name}|${exportKey}`);
      return { id: file, external: true };
    },
    outputOptions(options) {
      if (!active || used.size === 0) return null;
      return { ...options, paths: pathsWith(options.paths, used, ES_FORMATS.has(options.format)) };
    },
  };
};

export { buildCachePlugin };
