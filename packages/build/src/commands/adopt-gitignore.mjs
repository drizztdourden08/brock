/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const GENERATED = [
  'node_modules/',
  'dist/',
  'release/',
  '.user-data/',
  '.brock-port-slot',
  '**/build/icons/',
  '**/build/splash/',
  '**/build/installer-splash.png',
  '**/public/logos/icon.svg',
  '**/public/logos/icon.ico',
  '**/public/logos/icon-256.png',
  '**/public/logos/icon-bot.svg',
  '**/public/logos/icon-bot.ico',
  '**/public/logos/icon-bot-256.png',
  '**/.brock/profile-config.json',
];

/**
 * @param {string} rootDir
 * @returns {string[]} the lines added to .gitignore
 */
const ignoreGenerated = (rootDir) => {
  const file = join(rootDir, '.gitignore');
  const current = existsSync(file) ? readFileSync(file, 'utf8') : '';
  const present = new Set(current.split(/\r?\n/).map((line) => line.trim()));
  const added = GENERATED.filter((line) => !present.has(line));
  if (!added.length) return [];
  const lead = current && !current.endsWith('\n') ? '\n' : '';
  writeFileSync(file, `${current}${lead}${added.join('\n')}\n`, 'utf8');
  return added;
};

export { ignoreGenerated };
