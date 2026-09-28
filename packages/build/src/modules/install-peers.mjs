/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runPnpm } from '../run.mjs';

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));

/**
 * @param {string} rootDir the app folder
 * @param {string} packageName the module package
 * @returns {string[]} pnpm specs for peers the app does not declare yet
 */
const missingPeerSpecs = (rootDir, packageName) => {
  const app = readJson(join(rootDir, 'package.json'));
  const mod = readJson(join(rootDir, 'node_modules', ...packageName.split('/'), 'package.json'));
  const declared = { ...app.dependencies, ...app.devDependencies };
  const ranges = { ...mod.dependencies, ...mod.peerDependencies };
  return (mod.brock?.peers ?? [])
    .filter((name) => !declared[name])
    .map((name) => (ranges[name] && !String(ranges[name]).startsWith('catalog:') ? `${name}@${ranges[name]}` : name));
};

/**
 * @param {string} rootDir
 * @param {string} packageName
 * @returns {Promise<number>} exit code
 */
const installPeers = async (rootDir, packageName) => {
  const specs = missingPeerSpecs(rootDir, packageName);
  if (!specs.length) return 0;
  console.log(`brock add: the module needs ${specs.join(', ')} in the app`);
  return runPnpm(rootDir, ['add', ...specs]);
};

export { installPeers };
