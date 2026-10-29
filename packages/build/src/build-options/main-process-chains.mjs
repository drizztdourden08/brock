/* @layer tooling-scripts @kind logic */
import { relative } from 'node:path';
import { appRoots } from './app-roots.mjs';
import { MAX_REPORTED } from './main-process-guard.constants.mjs';
import { moduleFile } from './module-file.mjs';

const INSTALLED_FILE = /^.*\/node_modules\/((?:@[^/]+\/)?[^/]+\/.*)$/;

/**
 * @param {string} rootDir the app folder
 * @returns {(id: string) => string} a short name for a module in an import chain
 */
const chainLabeler = (rootDir) => {
  const roots = appRoots(rootDir);
  return (id) => {
    const file = moduleFile(id);
    const installed = INSTALLED_FILE.exec(file)?.[1];
    if (installed) return installed;
    const rel = roots.map((root) => relative(root, file).replace(/\\/g, '/')).find((path) => path && !path.startsWith('..'));
    return rel ?? file;
  };
};

const enqueueImports = (info, { parent, queue }) => {
  for (const next of [...info.importedIds, ...info.dynamicallyImportedIds]) {
    if (parent.has(next)) continue;
    parent.set(next, info.id);
    queue.push(next);
  }
};

/**
 * @param {object} input
 * @param {Pick<import('rollup').PluginContext, 'getModuleIds' | 'getModuleInfo'>} input.graph the finished module graph
 * @param {Map<string, Set<string>>} input.specifiers per importer, the forbidden package imports it wrote
 * @param {Set<string>} input.blocked the module ids those imports resolved to, not entered again
 * @param {{ forbidsModule: (id: string) => boolean }} input.rules what a module may not be
 * @param {(id: string) => string} input.label names a module id
 * @returns {string[][]} one chain of names per forbidden target
 */
const forbiddenChains = ({ graph, specifiers, blocked, rules, label }) => {
  const ids = [...graph.getModuleIds()];
  const queue = ids.filter((id) => graph.getModuleInfo(id)?.isEntry);
  const parent = new Map(queue.map((id) => [id, null]));
  const chainTo = (id) => (id === null ? [] : [...chainTo(parent.get(id)), label(id)]);
  const found = new Map();
  for (let at = 0; at < queue.length; at += 1) {
    const id = queue[at];
    const info = graph.getModuleInfo(id);
    if (blocked.has(id)) continue;
    if (!info.isExternal && rules.forbidsModule(id)) {
      if (!found.has(id)) found.set(id, chainTo(id));
      continue;
    }
    for (const specifier of specifiers.get(id) ?? []) if (!found.has(specifier)) found.set(specifier, [...chainTo(id), specifier]);
    enqueueImports(info, { parent, queue });
  }
  return [...found.values()];
};

/**
 * @param {string[][]} chains from forbiddenChains
 * @param {string} bundle what is being built, for the first sentence
 * @returns {string} the build error
 */
const chainsMessage = (chains, bundle) => {
  const shown = chains.slice(0, MAX_REPORTED).map((chain) => `  ${chain.join(' -> ')}`);
  const more = chains.length > MAX_REPORTED ? [`  and ${chains.length - MAX_REPORTED} more.`] : [];
  return [
    `The ${bundle} reaches renderer-only code. It runs in Node and must not load the UI.`,
    'Each line is an import chain from the entry to the forbidden module:',
    ...shown,
    ...more,
    'Cut the import, or move what main needs out of renderer code. To allow one on purpose, list it in mainProcess.allow in brock.config.ts.',
  ].join('\n');
};

export { chainLabeler, chainsMessage, forbiddenChains };
