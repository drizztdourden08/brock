/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { isAbsolute, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const PLUGIN_PACKAGE = /brock-plugin-/;
const PLUGIN_FOLDER = /^brock-plugin-/;

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

const foldersIn = (dir) => {
  try {
    return readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  } catch {
    return [];
  }
};

const dotFolderPlugins = (rootDir) => {
  const byName = new Map();
  for (const dot of foldersIn(rootDir).filter((name) => name.startsWith('.') && name !== '.git')) {
    const tools = join(rootDir, dot, 'tools');
    for (const name of foldersIn(tools).filter((folder) => PLUGIN_FOLDER.test(folder))) {
      if (!byName.has(name) && existsSync(join(tools, name, 'index.mjs'))) byName.set(name, join(tools, name));
    }
  }
  return [...byName.values()];
};

const discoveredEntries = (rootDir, listed) => {
  const fromPackages = declaredPluginPackages(rootDir).filter((name) => !listed.includes(name));
  return [...fromPackages, ...dotFolderPlugins(rootDir)];
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
