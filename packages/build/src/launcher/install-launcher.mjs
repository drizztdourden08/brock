/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { launcherSource } from './launcher-source.mjs';

/**
 * @param {Record<string, any>} pkg
 * @param {string} name
 * @param {string} path
 * @returns {boolean} whether bin changed
 */
const addBin = (pkg, name, path) => {
  if (typeof pkg.bin === 'object' && pkg.bin?.[name] === path) return false;
  const current = typeof pkg.bin === 'string' ? { [String(pkg.name ?? name).replace(/^@[^/]+\//, '')]: pkg.bin } : (pkg.bin ?? {});
  pkg.bin = { ...current, [name]: path };
  return true;
};

/**
 * @param {Record<string, any>} pkg
 * @param {string} command
 * @returns {boolean} whether postinstall changed
 */
const addPostinstall = (pkg, command) => {
  pkg.scripts = pkg.scripts ?? {};
  const current = pkg.scripts.postinstall;
  if (current?.includes(command)) return false;
  pkg.scripts.postinstall = current ? `${current} && ${command}` : command;
  return true;
};

/**
 * @param {string} rootDir
 * @param {string} name
 * @returns {string[]} the package.json fields changed
 */
const wirePackageJson = (rootDir, name) => {
  const file = join(rootDir, 'package.json');
  const pkg = JSON.parse(readFileSync(file, 'utf8'));
  const changed = [
    addBin(pkg, name, `./bin/${name}.mjs`) ? `bin.${name}` : null,
    addPostinstall(pkg, `node bin/${name}.mjs --link`) ? 'scripts.postinstall' : null,
  ].filter(Boolean);
  if (changed.length) writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  return changed;
};

/**
 * @param {string} rootDir the repo root
 * @param {string} name the command name
 * @param {boolean} force
 * @returns {{ file: string, written: boolean, fields: string[] }}
 */
const installLauncher = (rootDir, name, force) => {
  const file = `bin/${name}.mjs`;
  const target = join(rootDir, file);
  const source = launcherSource(name);
  const current = existsSync(target) ? readFileSync(target, 'utf8').replace(/\r\n/g, '\n') : null;
  const written = force || current !== source;
  if (written) {
    mkdirSync(join(rootDir, 'bin'), { recursive: true });
    writeFileSync(target, source, 'utf8');
  }
  return { file, written, fields: wirePackageJson(rootDir, name) };
};

export { installLauncher };
