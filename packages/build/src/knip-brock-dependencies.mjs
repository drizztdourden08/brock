/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { NODE_POLYFILLS_PACKAGE, NODE_POLYFILLS_SETTING } from './build-options/build-options.constants.mjs';
import { CONFIG_FILE } from './config.mjs';
import { sourceDependencies } from './vite-config.mjs';
import { SOURCE_SCOPE, SOURCE_SPECS } from './vite.constants.mjs';

const packageDirFrom = (fromDir, name) => {
  for (let at = fromDir; ; at = dirname(at)) {
    const candidate = join(at, 'node_modules', ...name.split('/'));
    if (existsSync(join(candidate, 'package.json'))) return realpathSync(candidate);
    if (dirname(at) === at) return null;
  }
};

const readPackage = (dir) => {
  try {
    return JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  } catch {
    return {};
  }
};

const isSource = (name, spec) => name.startsWith(SOURCE_SCOPE) || SOURCE_SPECS.some((prefix) => String(spec).startsWith(prefix));

const bundledNeeds = (appDir) => {
  const needed = new Set();
  const seen = new Set();
  const visit = (name, fromDir) => {
    const dir = packageDirFrom(fromDir, name);
    if (!dir || seen.has(dir)) return;
    seen.add(dir);
    const pkg = readPackage(dir);
    for (const [dep, spec] of Object.entries({ ...pkg.peerDependencies, ...pkg.dependencies })) {
      needed.add(dep);
      if (isSource(dep, spec)) visit(dep, dir);
    }
  };
  for (const name of sourceDependencies(appDir)) visit(name, appDir);
  if (NODE_POLYFILLS_SETTING.test(readFileSync(join(appDir, CONFIG_FILE), 'utf8'))) needed.add(NODE_POLYFILLS_PACKAGE);
  return needed;
};

const neededBy = (cwd) => {
  const byWorkspace = new Map();
  return (workspace) => {
    const dir = resolve(cwd, workspace ?? '.');
    if (!byWorkspace.has(dir)) byWorkspace.set(dir, existsSync(join(dir, CONFIG_FILE)) ? bundledNeeds(dir) : new Set());
    return byWorkspace.get(dir);
  };
};

const keptIssues = (byFile, needed) =>
  Object.entries(byFile)
    .map(([file, issues]) => [file, Object.fromEntries(Object.entries(issues).filter(([symbol, issue]) => !needed(issue.workspace).has(symbol)))])
    .filter(([, issues]) => Object.keys(issues).length > 0);

const countOf = (byFile) => Object.values(byFile).reduce((total, issues) => total + Object.keys(issues).length, 0);

const optionsOf = (data) => {
  try {
    return JSON.parse(data.preprocessorOptions || '{}');
  } catch {
    return {};
  }
};

const withoutInjectedHints = (data) => {
  const { source, injected = [] } = optionsOf(data);
  const globs = new Set(injected);
  const configurationHints = (data.configurationHints ?? []).filter((hint) => !(hint.type === 'ignore' && globs.has(hint.identifier)));
  return { ...data, configurationHints, ...(source ? { configFilePath: join(data.cwd, source) } : {}) };
};

const keepBundledNeeds = (data) => {
  const before = data.issues.dependencies ?? {};
  const dependencies = Object.fromEntries(keptIssues(before, neededBy(data.cwd)));
  const dropped = countOf(before) - countOf(dependencies);
  return { ...data, issues: { ...data.issues, dependencies }, counters: { ...data.counters, dependencies: data.counters.dependencies - dropped } };
};

/**
 * @param {{ cwd: string, issues: Record<string, Record<string, Record<string, { workspace?: string }>>>, counters: Record<string, number>, configurationHints?: { type: string, identifier: unknown }[], preprocessorOptions?: string }} data the knip results
 * @returns {object} the results, minus what bundled packages need
 */
const keepBrockRuntimeDependencies = (data) => keepBundledNeeds(withoutInjectedHints(data));

export default keepBrockRuntimeDependencies;
