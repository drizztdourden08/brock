/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { TESSERA_CONFIG_FILE } from './tessera.constants.mjs';

const partsOf = (entry) => typeof entry?.guide?.parts === 'string' && entry.guide.parts.length > 0;

const hasGuideParts = (rootDir) => {
  const file = join(rootDir, TESSERA_CONFIG_FILE);
  if (!existsSync(file)) return false;
  let config;
  try {
    config = JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return false;
  }
  return partsOf(config) || Object.values(config?.apps ?? {}).some(partsOf);
};

export { hasGuideParts };
