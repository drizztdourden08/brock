/* @layer tooling-scripts @kind logic */
import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { readJson } from '../read-json.mjs';

const AUTOMATION_PREFIX = 'agent/';

const latestPersonalProfile = (profilesDir) => {
  if (!existsSync(profilesDir)) return null;
  const profiles = readdirSync(profilesDir)
    .map((id) => readJson(join(profilesDir, id, 'profile.json'), null))
    .filter((profile) => profile && !String(profile.name ?? '').startsWith(AUTOMATION_PREFIX))
    .sort((a, b) => (b.lastPlayed ?? 0) - (a.lastPlayed ?? 0));
  return profiles[0] ?? null;
};

/**
 * @param {{ profileDir: string, slot: number, sourceData: string, states: object, log: (message: string) => void }} request
 * @returns {void}
 */
const seedQuickSave = ({ profileDir, slot, sourceData, states, log }) => {
  const toDir = join(profileDir, states.savesDir, states.quickDir);
  const dest = join(toDir, `save${slot}.sav`);
  if (existsSync(dest)) {
    log(`Quick slot ${slot + 1} is already present; left as it is.`);
    return;
  }
  const source = latestPersonalProfile(join(sourceData, 'profiles'));
  if (!source) throw new Error('No personal profile found in the app data to copy a quick save from.');
  const fromDir = join(sourceData, 'profiles', source.id, states.savesDir, states.quickDir);
  const sav = join(fromDir, `save${slot}.sav`);
  if (!existsSync(sav)) throw new Error(`Quick slot ${slot + 1} has no save under ${fromDir}; nothing to copy.`);
  mkdirSync(toDir, { recursive: true });
  cpSync(sav, dest);
  const png = join(fromDir, `save${slot}.png`);
  if (existsSync(png)) cpSync(png, join(toDir, `save${slot}.png`));
  log(`Quick slot ${slot + 1} copied from the profile "${source.name}".`);
};

export { seedQuickSave };
