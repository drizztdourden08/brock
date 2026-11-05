/* @layer tooling-scripts @kind build */
import { relative } from 'node:path';
import { apworldJob } from './apworld-job.mjs';
import { loadKit } from './load-kit.mjs';
import { packApworld } from './pack-apworld.mjs';
import { readExportDir } from './read-export-dir.mjs';
import { writePublicBuilds } from './write-public-builds.mjs';

/**
 * Builds the apworld set from the game's JSON export.
 * @param {string} rootDir The app root
 * @param {any} config The app's brock config
 * @param {object} options The command options
 * @returns {Promise<string>} one line saying what was written
 */
const buildApworld = async (rootDir, config, options) => {
  const job = apworldJob(rootDir, config, options);
  const data = readExportDir(job.dataDir);
  const kit = await loadKit(rootDir);
  const built = await packApworld(kit, job, data);
  if (job.publicDir) writePublicBuilds(kit, job, built);
  const first = built.index.builds[0];
  return `${relative(rootDir, job.outDir) || '.'}: ${built.files.length} apworld files (${first.sha256.slice(0, 12)}, ${first.size} bytes each)`;
};

export { buildApworld };
