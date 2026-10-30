/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { attempt } from './replay-exec.mjs';

const FIELDS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
const EXACT = /^v?\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/;

const slash = (path) => String(path).replace(/\\/g, '/').toLowerCase();

/**
 * @param {string[]} args localpkg arguments
 * @returns {{ command: string, args: string[] }} localpkg, or node on LOCALPKG_BIN
 */
const localpkgCall = (args) => (process.env.LOCALPKG_BIN ? { command: 'node', args: [process.env.LOCALPKG_BIN, ...args] } : { command: 'localpkg', args });

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

/**
 * @param {Function} exec the runner seam
 * @param {string} cwd the repo root
 * @returns {{ builds: object[], consumers: object[] }} localpkg status, empty when unreadable
 */
const localpkgStatus = (exec, cwd) => {
  try {
    const { command, args } = localpkgCall(['status', '--json']);
    const parsed = JSON.parse(attempt(exec, command, args, cwd));
    return { builds: parsed.builds ?? [], consumers: parsed.consumers ?? [] };
  } catch {
    return { builds: [], consumers: [] };
  }
};

/**
 * @param {{ consumers: object[] }} status
 * @param {string} cwd the repo root
 * @returns {boolean} true when localpkg is on for this repo
 */
const isConsumer = (status, cwd) => status.consumers.some((entry) => slash(entry.root) === slash(cwd));

const versionNeeded = (spec, built) => (EXACT.test(spec) ? spec.replace(/^v/, '') : built);

/**
 * @param {{ exec: Function, cwd: string, status: { builds: object[] } }} input
 * @returns {{ name: string, version: string }[]} the moved packages this repo depends on
 */
const neededVersions = ({ exec, cwd, status }) => {
  const manifests = manifestsOf(exec, cwd);
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

export { isConsumer, localpkgCall, localpkgStatus, neededVersions };
