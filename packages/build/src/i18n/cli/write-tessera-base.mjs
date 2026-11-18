/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { cliResult } from './cli-result.mjs';
import { TESSERA_BASE_OUTPUT } from './cli.constants.mjs';
import { loadTesseraStrings } from './load-tessera-strings.mjs';
import { renderTesseraBase } from './render-tessera-base.mjs';

const isBrockRepo = (rootDir) => existsSync(join(rootDir, 'packages', 'modules'));

/**
 * @param {{ rootDir: string, out?: string }} input where the command runs and the output file
 * @returns {Promise<import('./cli-result.mjs').CliResult>} the English Tessera messages written
 */
const writeTesseraBase = async ({ rootDir, out }) => {
  const target = out ? join(rootDir, out) : join(rootDir, TESSERA_BASE_OUTPUT);
  if (!out && !isBrockRepo(rootDir)) return cliResult({ errors: ['brock i18n tessera-base: outside the Brock repo, name the output with --out <file>'] });
  const { messages, notes } = renderTesseraBase(await loadTesseraStrings(rootDir));
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${JSON.stringify(messages, null, 2)}\n`);
  return cliResult({ warnings: notes, lines: [`brock i18n tessera-base: ${Object.keys(messages).length} message(s) written to ${target}`] });
};

export { writeTesseraBase };
