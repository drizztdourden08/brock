/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { coordHome } from '../local/coord-home.mjs';
import { stop } from '../release/local/release-stop.mjs';

const MANIFEST = 'release.json';

const notDone = (record) => record?.replay?.state !== 'done';

const oldestFirst = (key) => (a, b) => String(a[key] ?? '').localeCompare(String(b[key] ?? ''));

const subdirs = (dir) =>
  existsSync(dir) ? readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isDirectory() && !entry.name.startsWith('.')).map((entry) => entry.name) : [];

const manifestAt = (dir) => {
  try {
    const manifest = JSON.parse(readFileSync(join(dir, MANIFEST), 'utf8'));
    return manifest?.kind === 'release' ? manifest : null;
  } catch {
    return null;
  }
};

/**
 * @param {{ exec: Function, cwd: string, project: string }} input exec is the runner seam
 * @returns {object[]} the merged local PR records not replayed yet, oldest first
 */
const pendingPrs = ({ exec, cwd, project }) => {
  let list;
  try {
    const parsed = JSON.parse(exec('coord', ['pr', 'list', '--json'], { cwd, env: { COORD_PROJECT: project } }));
    list = Array.isArray(parsed) ? parsed : (parsed.prs ?? []);
  } catch (error) {
    throw stop(`coord pr list --json failed: ${String(error.message).split('\n')[0]}`, 1);
  }
  return list.filter((pr) => pr.status === 'merged' && notDone(pr)).sort(oldestFirst('mergedAt'));
};

/**
 * @param {string} project
 * @returns {object[]} pending release manifests with dir, oldest first
 */
const pendingReleases = (project) => {
  const root = join(coordHome(), 'releases', project);
  const found = [];
  for (const channel of subdirs(root)) {
    for (const version of subdirs(join(root, channel))) {
      const dir = join(root, channel, version);
      const manifest = manifestAt(dir);
      if (manifest && notDone(manifest)) found.push({ ...manifest, dir });
    }
  }
  return found.sort(oldestFirst('createdAt'));
};

/**
 * @param {string} cwd the repo root
 * @param {string} name a package name
 * @returns {string} the registry .npmrc names for the package scope
 */
const registryOf = (cwd, name) => {
  const file = join(cwd, '.npmrc');
  const lines = existsSync(file) ? readFileSync(file, 'utf8').split(/\r?\n/).map((line) => line.trim()) : [];
  const valueOf = (key) => lines.find((line) => line.startsWith(`${key}=`))?.slice(key.length + 1).trim();
  const scope = name.startsWith('@') ? name.split('/')[0] : null;
  const registry = (scope && valueOf(`${scope}:registry`)) || valueOf('registry');
  if (!registry) throw stop(`.npmrc at ${cwd} names no registry for ${name}.`);
  return registry;
};

export { pendingPrs, pendingReleases, registryOf };
