/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { keepCrossDriveLinks, linkSpec } from '@drizztdourden08/brock-thread';
import { CONFIG_FILE } from '../config.mjs';
import { installPeers } from '../modules/install-peers.mjs';
import { packageNameOf, parseAddInput } from '../modules/registry.mjs';
import { resolveModules } from '../modules/resolve.mjs';
import { runPnpm } from '../run.mjs';
import { runSync } from './sync.mjs';

const MODULES_ARRAY = /(modules:\s*\[)([^\]]*)(\])/;

/**
 * @param {string} source
 * @param {string} id
 */
const appendModuleId = (source, id) => {
  const match = MODULES_ARRAY.exec(source);
  if (!match) throw new Error(`${CONFIG_FILE}: no \`modules: [...]\` array to edit`);
  const [, open, body, close] = match;
  if (new RegExp(`['"]${id}['"]`).test(body)) return source;
  const trimmed = body.replace(/[\s,]+$/, '');
  const tail = body.slice(trimmed.length).replace(/,/g, '');
  const entry = `'${id}'`;
  let next = entry;
  if (trimmed.trim() && tail.includes('\n')) {
    const indent = /\n([ \t]*)\S/.exec(trimmed)?.[1] ?? '  ';
    next = `${trimmed},\n${indent}${entry},${tail}`;
  } else if (trimmed.trim()) next = `${trimmed}, ${entry}${tail}`;
  return source.replace(MODULES_ARRAY, `${open}${next}${close}`);
};

const idOfInstalled = (rootDir, packageName) => {
  const require = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));
  const declared = Object.keys({ ...(require.dependencies ?? {}), ...(require.devDependencies ?? {}) });
  if (!declared.includes(packageName)) throw new Error(`${packageName} is not in package.json after install`);
  const file = join(rootDir, 'node_modules', ...packageName.split('/'), 'package.json');
  const pkg = JSON.parse(readFileSync(file, 'utf8'));
  if (!pkg.brock?.id) throw new Error(`${packageName} has no package.json#brock manifest; it is not a Brock module`);
  return pkg.brock.id;
};

const linkLocalModule = (rootDir, id, packageName, local) => {
  const dir = resolve(local, 'packages/modules', id);
  if (!existsSync(join(dir, 'package.json'))) throw new Error(`No module package at ${dir}`);
  const file = join(rootDir, 'package.json');
  const pkg = JSON.parse(readFileSync(file, 'utf8'));
  pkg.dependencies = { ...(pkg.dependencies ?? {}), [packageName]: linkSpec(dir) };
  writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  if (keepCrossDriveLinks(rootDir).length) console.log('brock add: the link crosses drives; .npmrc and .gitattributes carry the lines for it');
};

/**
 * @param {{ rootDir: string, input: string, local?: string}} ctx
 * @returns {Promise<number>} exit code
 */
const runAdd = async ({ rootDir, input, local }) => {
  if (!input) {
    console.error('Usage: brock add <id | package-spec> [--local <brockRepo>]');
    return 1;
  }
  const { spec, id: knownId } = parseAddInput(input);
  const useLocal = Boolean(local && knownId);
  if (useLocal) {
    linkLocalModule(rootDir, knownId, packageNameOf(spec), local);
    console.log(`brock add: linked ${packageNameOf(spec)} from ${local}`);
  } else console.log(`brock add: installing ${spec}`);
  const code = await runPnpm(rootDir, useLocal ? ['install'] : ['add', spec]);
  if (code !== 0) return code;

  const id = knownId ?? idOfInstalled(rootDir, packageNameOf(spec));
  const { missing } = resolveModules(rootDir, [id]);
  if (missing.length) throw new Error(`Installed ${spec}, but no package with brock.id "${id}" resolves from ${rootDir}`);
  const peersCode = await installPeers(rootDir, packageNameOf(spec));
  if (peersCode !== 0) return peersCode;

  const configPath = join(rootDir, CONFIG_FILE);
  const source = readFileSync(configPath, 'utf8');
  const edited = appendModuleId(source, id);
  if (edited !== source) {
    writeFileSync(configPath, edited, 'utf8');
    console.log(`brock add: recorded "${id}" in ${CONFIG_FILE}`);
  } else console.log(`brock add: "${id}" already listed in ${CONFIG_FILE}`);
  return runSync({ rootDir });
};

export { runAdd, appendModuleId };
