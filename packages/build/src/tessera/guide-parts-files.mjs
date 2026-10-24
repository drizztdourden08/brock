/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { TESSERA_CONFIG_FILE } from './tessera.constants.mjs';

const partsOf = (entry) => (typeof entry?.guide?.parts === 'string' && entry.guide.parts.length > 0 ? [entry.guide.parts] : []);

/**
 * @param {string} configDir  the folder of tessera.config.json
 * @returns {string[]}  the absolute guide.parts paths
 */
const guidePartsFiles = (configDir) => {
  const file = join(configDir, TESSERA_CONFIG_FILE);
  if (!existsSync(file)) return [];
  try {
    const config = JSON.parse(readFileSync(file, 'utf8'));
    return [...partsOf(config), ...Object.values(config?.apps ?? {}).flatMap(partsOf)].map((path) => resolve(configDir, path));
  } catch {
    return [];
  }
};

export { guidePartsFiles };
