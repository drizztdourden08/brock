/* @layer tooling-scripts @kind logic */
import { readFileSync, rmSync } from 'node:fs';
import { TEMPLATE_DIR } from './apworld.constants.mjs';

/**
 * Zips the generic loader and the game's JSON into one .apworld per Archipelago version, plus the index.
 * @param {object} kit The loaded client kit
 * @param {{ outDir: string, moduleName: string, versions: string[], authors: string[], appVersion: string }} job
 * @param {Record<string, unknown>} data File name to parsed JSON, the export
 * @returns {Promise<{ files: string[], index: any, bytes: Buffer }>}
 */
const packApworld = async (kit, job, data) => {
  const { outDir, moduleName, versions, authors, appVersion } = job;
  const { game, worldVersion } = data['game.json'];
  rmSync(outDir, { recursive: true, force: true });
  const result = await kit.buildApworldSet({
    game,
    worldVersion,
    appVersion,
    minimumAp: versions[0],
    maximumAp: versions[versions.length - 1],
    module: moduleName,
    authors,
    worldDir: TEMPLATE_DIR,
    outDir,
    data,
    exclude: ['__pycache__'],
    builds: versions.map((archipelagoVersion) => ({ archipelagoVersion })),
  });
  const release = await kit.writeReleaseFiles({ dir: outDir, module: moduleName, direct: true, playerFile: 'app' });
  for (const warning of release.warnings) console.warn(`brock apworld: ${warning}`);
  return {
    files: [...result.files.map((file) => file.file), `${moduleName}.apworld`],
    index: result.index,
    bytes: readFileSync(result.latestPath),
  };
};

export { packApworld };
