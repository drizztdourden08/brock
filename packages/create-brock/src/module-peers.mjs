/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * @param {string} id
 * @param {{ local?: string | null, templateDir: string }} roots
 * @returns {string[]}
 */
const manifestCandidates = (id, { local, templateDir }) =>
  [local ? join(local, 'packages/modules', id) : null, resolve(templateDir, '../../packages/modules', id)]
    .filter((dir) => dir !== null)
    .map((dir) => join(dir, 'package.json'));

/**
 * @param {string} id
 * @param {{ local?: string | null, templateDir: string }} roots
 * @returns {Record<string, string> | null} null without a manifest on disk
 */
const modulePeers = (id, roots) => {
  const file = manifestCandidates(id, roots).find((candidate) => existsSync(candidate));
  if (!file) return null;
  const pkg = JSON.parse(readFileSync(file, 'utf8'));
  const ranges = { ...pkg.peerDependencies, ...pkg.dependencies };
  return Object.fromEntries((pkg.brock?.peers ?? []).map((name) => [name, ranges[name] ?? 'latest']));
};

export { modulePeers };
