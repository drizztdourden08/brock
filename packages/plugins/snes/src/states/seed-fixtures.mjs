/* @layer tooling-scripts @kind logic */
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { readJson } from '../read-json.mjs';
import { writeJson } from '../write-json.mjs';

const copyFixture = ({ entry, fixtureDir, destDir }) => {
  const sav = join(fixtureDir, `${entry.name}.sav`);
  if (!existsSync(sav)) return false;
  cpSync(sav, join(destDir, `${entry.id}.sav`));
  const png = join(fixtureDir, `${entry.name}.png`);
  if (existsSync(png)) cpSync(png, join(destDir, `${entry.id}.png`));
  return true;
};

/**
 * @param {{ fixtureDir: string, destDir: string, log: (message: string) => void }} request
 * @returns {number} how many fixtures were added
 */
const seedFixtures = ({ fixtureDir, destDir, log }) => {
  const manifestPath = join(fixtureDir, 'manifest.json');
  if (!existsSync(manifestPath)) {
    log('No save-state fixtures found (no vault access); skipping.');
    return 0;
  }
  mkdirSync(destDir, { recursive: true });
  const destManifestPath = join(destDir, 'manifest.json');
  const destManifest = readJson(destManifestPath, []);
  const present = new Set(destManifest.map((entry) => entry.name));
  const added = readJson(manifestPath, []).filter((entry) => !present.has(entry.name) && copyFixture({ entry, fixtureDir, destDir }));
  if (added.length > 0) writeJson(destManifestPath, [...destManifest, ...added]);
  log(`${added.length} save-state fixture(s) seeded into the profile.`);
  return added.length;
};

export { seedFixtures };
