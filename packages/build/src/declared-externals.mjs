/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { builtinModules } from 'node:module';
import { isAbsolute, resolve } from 'node:path';

const BUILTINS = new Set([...builtinModules, 'electron']);

const packageNameOf = (id) => {
  if (id.startsWith('node:') || isAbsolute(id) || /^[a-z][\w+.-]*:\/\//i.test(id)) return null;
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
 * @param {() => string[]} [extraImports] runtime packages of the code served from the build cache
 */
const declaredExternalsPlugin = (rootDir, knownSpecs, extraImports = () => []) => ({
  name: 'brock-declared-externals',
  generateBundle(_options, bundle) {
    const declared = appDependencies(rootDir);
    const chunkImports = Object.values(bundle).flatMap((chunk) => (chunk.type === 'chunk' ? chunk.imports : []));
    const names = [...extraImports(), ...chunkImports].map(packageNameOf).filter((name) => name && !(name in declared));
    const missing = new Map(names.map((name) => [name, knownSpecs.get(name) ?? 'catalog:']));
    if (missing.size === 0) return;
    const lines = [...missing].map(([name, spec]) => `    "${name}": "${spec}",`).join('\n');
    this.error(
      `brock: ${missing.size} package(s) this bundle imports at runtime are not declared by the app, so main cannot load them. `
      + `Add to ${resolve(rootDir, 'package.json')} "dependencies":\n${lines}\nthen run pnpm install.`,
    );
  },
});

export { declaredExternalsPlugin, packageNameOf };
