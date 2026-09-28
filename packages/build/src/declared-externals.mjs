/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { builtinModules } from 'node:module';
import { resolve } from 'node:path';

const BUILTINS = new Set([...builtinModules, 'electron']);

const packageNameOf = (id) => {
  if (id.startsWith('node:')) return null;
  const parts = id.split('/');
  const name = id.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
  return BUILTINS.has(name) ? null : name;
};

const appDependencies = (rootDir) => {
  try {
    return JSON.parse(readFileSync(resolve(rootDir, 'package.json'), 'utf8')).dependencies ?? {};
  } catch {
    return {};
  }
};

/**
 * @param {string} rootDir The app root
 * @param {Map<string, string>} knownSpecs Specs the owning packages declare, to suggest
 */
const declaredExternalsPlugin = (rootDir, knownSpecs) => ({
  name: 'brock-declared-externals',
  generateBundle(_options, bundle) {
    const declared = appDependencies(rootDir);
    const missing = new Map();
    for (const chunk of Object.values(bundle)) {
      if (chunk.type !== 'chunk') continue;
      for (const id of chunk.imports) {
        const name = packageNameOf(id);
        if (name && !(name in declared)) missing.set(name, knownSpecs.get(name) ?? 'catalog:');
      }
    }
    if (missing.size === 0) return;
    const lines = [...missing].map(([name, spec]) => `    "${name}": "${spec}",`).join('\n');
    this.error(
      `brock: ${missing.size} package(s) this bundle imports at runtime are not declared by the app, so main cannot load them. `
      + `Add to ${resolve(rootDir, 'package.json')} "dependencies":\n${lines}\nthen run pnpm install.`,
    );
  },
});

export { declaredExternalsPlugin, packageNameOf };
