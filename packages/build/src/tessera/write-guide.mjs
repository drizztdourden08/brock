/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { runTesseraCommand } from '../commands/tessera.mjs';
import { findWorkspaceRoot } from '../workspace.mjs';
import { sameText, settleLineEndings } from '../write-changed.mjs';
import { guidePartsFiles } from './guide-parts-files.mjs';
import { guideRunDirs } from './guide-run-dirs.mjs';
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

const runGuideIn = async (configDir, cwd, label) => {
  if (cwd !== configDir) console.log(`${label}: running it in ${relative(configDir, cwd).replace(/\\/g, '/')}, which has Tessera installed.`);
  const code = await runTesseraCommand({ args: ['guide'], cwd });
  if (code !== 0) console.warn(`${label}: tessera guide reported problems; brock tessera check lists them.`);
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
  const parts = guidePartsFiles(configDir);
  const before = new Map(parts.map((file) => [file, existsSync(file) ? readFileSync(file, 'utf8') : null]));
  for (const cwd of guideRunDirs(configDir)) await runGuideIn(configDir, cwd, label);
  for (const file of parts) settleLineEndings(file, before.get(file));
};

const restore = (file, before) => {
  if (before === null) rmSync(file, { force: true });
  else if (!existsSync(file) || readFileSync(file, 'utf8') !== before) writeFileSync(file, before, 'utf8');
};

/**
 * @param {string} rootDir  The app or workspace root
 * @param {{ label?: string }} [options]
 * @returns {Promise<string[]>}  one problem per parts file that differs
 */
const guideProblems = async (rootDir, { label = 'brock check' } = {}) => {
  const configDir = configDirOf(rootDir);
  if (!hasGuideParts(configDir)) return [];
  const parts = guidePartsFiles(configDir);
  const before = new Map(parts.map((file) => [file, existsSync(file) ? readFileSync(file, 'utf8') : null]));
  for (const cwd of guideRunDirs(configDir)) await runGuideIn(configDir, cwd, label);
  const problems = parts.filter((file) => {
    const wanted = existsSync(file) ? readFileSync(file, 'utf8') : null;
    const had = before.get(file);
    return wanted !== null && (had === null || !sameText(had, wanted));
  }).map((file) => `${relative(configDir, file).replace(/\\/g, '/')} does not list the parts of the app; run brock sync to write it`);
  for (const file of parts) restore(file, before.get(file));
  return problems;
};

export { guideProblems, writeGuide };
