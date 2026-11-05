/* @layer tooling-scripts @kind build */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { apworldJob } from './apworld-job.mjs';
import { TEMPLATE_DIR } from './apworld.constants.mjs';
import { buildApworld } from './build-apworld.mjs';
import { exportApworld } from './export-apworld.mjs';

const IGNORED_NAMES = new Set(['node_modules', '__pycache__']);

/**
 * @param {string} target A file or a folder
 * @returns {number} the newest modification time under it, in milliseconds
 */
const newestUnder = (target) => {
  const stat = statSync(target);
  if (!stat.isDirectory()) return stat.mtimeMs;
  return readdirSync(target)
    .filter((name) => !IGNORED_NAMES.has(name))
    .reduce((newest, name) => Math.max(newest, newestUnder(join(target, name))), 0);
};

/**
 * @param {string} rootDir The app root
 * @param {{ outDir: string, moduleName: string }} job The build job
 * @param {{ entry?: string, sources?: string[] }} options The command options
 * @returns {boolean} true when the built apworld is newer than every source
 */
const isCurrent = (rootDir, job, options) => {
  const built = join(job.outDir, `${job.moduleName}.apworld`);
  if (!existsSync(built)) return false;
  const roots = options.sources ?? (options.entry ? [dirname(options.entry)] : []);
  const sources = [join(rootDir, 'package.json'), TEMPLATE_DIR, ...roots.map((root) => resolve(rootDir, root))];
  return sources.filter((source) => existsSync(source)).every((source) => newestUnder(source) <= statSync(built).mtimeMs);
};

/**
 * @param {string} rootDir The app root
 * @param {any} config The app's brock config
 * @param {object} options The command options
 * @returns {Promise<string>} one line saying what happened
 */
const ensureApworld = async (rootDir, config, options) => {
  if (isCurrent(rootDir, apworldJob(rootDir, config, options), options)) return 'up to date';
  const exported = await exportApworld(rootDir, options);
  return `${exported}; ${await buildApworld(rootDir, config, options)}`;
};

export { ensureApworld };
