/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { coordHome } from '../local/coord-home.mjs';
import { attempt } from './replay-exec.mjs';

const FIELDS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
const EXACT = /^v?\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/;

const slash = (path) => String(path).replace(/\\/g, '/').toLowerCase();

const HOOK_MARKER = 'localpkg: generated';

/**
 * @param {Function} exec the runner seam
 * @param {string} cwd the repo root
 * @returns {{ command: string, prefix: string[] } | null} LOCALPKG_BIN, else localpkg on the PATH
 */
const resolveBinary = (exec, cwd) => {
  if (process.env.LOCALPKG_BIN) return { command: 'node', prefix: [process.env.LOCALPKG_BIN] };
  return attempt(exec, 'localpkg', ['help'], cwd) === null ? null : { command: 'localpkg', prefix: [] };
};

/**
 * @param {{ command: string, prefix: string[] } | null} binary
 * @param {string[]} args localpkg arguments
 * @returns {{ command: string, args: string[] }} the call, with the bare name when no binary resolved
 */
const localpkgCall = (binary, args) => ({ command: binary?.command ?? 'localpkg', args: [...(binary?.prefix ?? []), ...args] });

const readManifest = (cwd, relative) => {
  const file = join(cwd, relative);
  try {
    return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
  } catch {
    return null;
  }
};

const manifestsOf = (exec, cwd) => {
  const listed = (attempt(exec, 'git', ['ls-files'], cwd) ?? '').split('\n').map((line) => line.trim());
  const names = new Set(['package.json', ...listed.filter((path) => basename(path) === 'package.json' && !path.includes('node_modules'))]);
  return [...names].map((name) => readManifest(cwd, name)).filter(Boolean);
};

const readJson = (file) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
};

const stateFiles = () => {
  const home = process.env.LOCALPKG_HOME || join(coordHome(), 'localpkg');
  const index = readJson(join(home, 'index.json')).packages ?? {};
  const consumers = readJson(join(home, 'consumers.json'));
  return {
    builds: Object.entries(index).map(([name, entry]) => ({ name, ...entry })),
    consumers: Object.keys(consumers).map((root) => ({ root })),
  };
};

const statusByBinary = (exec, cwd, binary) => {
  try {
    const { command, args } = localpkgCall(binary, ['status', '--json']);
    const parsed = JSON.parse(attempt(exec, command, args, cwd));
    return { builds: parsed.builds ?? [], consumers: parsed.consumers ?? [] };
  } catch {
    return { builds: [], consumers: [] };
  }
};

const hookPresent = (cwd) => {
  try {
    return readFileSync(join(cwd, '.pnpmfile.cjs'), 'utf8').includes(HOOK_MARKER);
  } catch {
    return false;
  }
};

/**
 * @param {Function} exec the runner seam
 * @param {string} cwd the repo root
 * @param {object | null} binary the resolved localpkg
 * @returns {{ builds: object[], consumers: object[], hook: boolean }} the state files, the binary status and the hook file
 */
const localpkgStatus = (exec, cwd, binary) => {
  const files = stateFiles();
  const live = binary ? statusByBinary(exec, cwd, binary) : { builds: [], consumers: [] };
  const builds = new Map([...files.builds, ...live.builds].map((build) => [build.name, build]));
  return { builds: [...builds.values()], consumers: [...files.consumers, ...live.consumers], hook: hookPresent(cwd) };
};

/**
 * @param {{ consumers: object[], hook: boolean }} status
 * @param {string} cwd the repo root
 * @returns {boolean} true when localpkg is on for this repo
 */
const isConsumer = (status, cwd) => status.hook || status.consumers.some((entry) => slash(entry.root) === slash(cwd));

const versionNeeded = (spec, built) => (EXACT.test(spec) ? spec.replace(/^v/, '') : built);

/**
 * @param {{ manifests: object[], status: { builds: object[] } }} input
 * @returns {{ name: string, version: string }[]} the moved packages these manifests depend on
 */
const neededIn = ({ manifests, status }) => {
  const own = new Set(manifests.map((manifest) => manifest.name));
  const built = new Map(status.builds.map((build) => [build.name, build.version]));
  const needs = new Map();
  const deps = manifests.flatMap((manifest) => FIELDS.flatMap((field) => Object.entries(manifest[field] ?? {})));
  for (const [name, spec] of deps) {
    if (!built.has(name) || own.has(name) || String(spec).startsWith('workspace:')) continue;
    const version = versionNeeded(String(spec), built.get(name));
    needs.set(`${name}@${version}`, { name, version });
  }
  return [...needs.values()];
};

/**
 * @param {{ exec: Function, cwd: string, status: { builds: object[] } }} input
 * @returns {{ name: string, version: string }[]} the moved packages this repo depends on
 */
const neededVersions = ({ exec, cwd, status }) => neededIn({ manifests: manifestsOf(exec, cwd), status });

export { isConsumer, localpkgCall, localpkgStatus, neededIn, neededVersions, resolveBinary };
