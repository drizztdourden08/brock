/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runTesseraCommand } from '../commands/tessera.mjs';
import { findWorkspaceRoot } from '../workspace.mjs';
import { hasGuideParts } from './has-guide-parts.mjs';
import { GUIDE_OUT, TESSERA_CONFIG_FILE } from './tessera.constants.mjs';

const configDirOf = (rootDir) => (existsSync(join(rootDir, TESSERA_CONFIG_FILE)) ? rootDir : findWorkspaceRoot(rootDir) ?? rootDir);

const guideOutOf = (configDir) => {
  try {
    const out = JSON.parse(readFileSync(join(configDir, TESSERA_CONFIG_FILE), 'utf8'))?.guide?.out;
    return typeof out === 'string' && out.length > 0 ? out : GUIDE_OUT;
  } catch {
    return GUIDE_OUT;
  }
};

/**
 * @param {string} rootDir  The app or workspace root
 * @param {{ label?: string, missingOnly?: boolean }} [options]  missingOnly runs it only when the guide folder is not there
 * @returns {Promise<void>}
 */
const writeGuide = async (rootDir, { label = 'brock sync', missingOnly = false } = {}) => {
  const configDir = configDirOf(rootDir);
  if (!hasGuideParts(configDir)) return;
  const out = guideOutOf(configDir);
  if (missingOnly && existsSync(join(configDir, out))) return;
  console.log(missingOnly ? `${label}: ${out}/ is missing, running tessera guide.` : `${label}: tessera.config.json sets guide.parts, running tessera guide.`);
  const code = await runTesseraCommand({ args: ['guide'], cwd: configDir });
  if (code !== 0) console.warn(`${label}: tessera guide reported problems; brock tessera check lists them.`);
};

export { writeGuide };
