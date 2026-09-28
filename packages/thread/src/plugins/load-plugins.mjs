/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { isAbsolute, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const AI_PLUGIN_DIRS = ['.claude/tools/brock-plugin-ai', '.ai/tools/brock-plugin-ai'];
const PLUGIN_PACKAGE = /brock-plugin-/;

const importPlugin = async (rootDir, entry) => {
  if (typeof entry !== 'string') return entry;
  const isPath = entry.startsWith('.') || isAbsolute(entry);
  const target = isPath ? resolve(rootDir, entry) : createRequire(join(rootDir, 'package.json')).resolve(entry);
  const file = isPath && existsSync(join(target, 'index.mjs')) ? join(target, 'index.mjs') : target;
  const mod = await import(pathToFileURL(file).href);
  const loaded = mod.default ?? mod.plugin;
  if (!loaded?.name || !loaded.verbs) throw new Error(`plugin "${entry}" exports neither a default nor a "plugin" definePlugin({ ... }).`);
  return loaded;
};

const declaredPluginPackages = (rootDir) => {
  try {
    const pkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));
    return Object.keys({ ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) }).filter((name) => PLUGIN_PACKAGE.test(name));
  } catch {
    return [];
  }
};

const discoveredEntries = (rootDir, listed) => {
  const fromPackages = declaredPluginPackages(rootDir).filter((name) => !listed.includes(name));
  const aiDir = AI_PLUGIN_DIRS.map((dir) => join(rootDir, dir)).find((dir) => existsSync(join(dir, 'index.mjs')));
  return [...fromPackages, ...(aiDir ? [aiDir] : [])];
};

const mergeVerbs = (plugins) => {
  const verbs = {};
  for (const plugin of plugins) {
    for (const [key, verb] of Object.entries(plugin.verbs)) {
      if (verbs[key]) throw new Error(`verb "${key}" is defined by two plugins (${verbs[key].plugin} and ${plugin.name}).`);
      verbs[key] = { ...verb, plugin: plugin.name };
    }
  }
  return verbs;
};

/**
 * @param {string} rootDir
 * @param {import('../workspace/workspace.type.mjs').Workspace} workspace
 * @returns {Promise<{ plugins: import('../workspace/workspace.type.mjs').Plugin[], verbs: Record<string, import('../workspace/workspace.type.mjs').Verb> }>}
 */
const loadPlugins = async (rootDir, workspace) => {
  const listed = workspace.plugins.filter((entry) => typeof entry === 'string');
  const entries = [...workspace.plugins, ...discoveredEntries(rootDir, listed)];
  const plugins = [];
  for (const entry of entries) plugins.push(await importPlugin(rootDir, entry));
  return { plugins, verbs: mergeVerbs(plugins) };
};

export { loadPlugins };
