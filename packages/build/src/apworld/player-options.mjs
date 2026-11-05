/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';

/**
 * @param {string[]} sets key=value words
 * @returns {Record<string, string>} the option values they name
 */
const optionsOfSets = (sets) => Object.fromEntries(sets.map((entry) => {
  const at = entry.indexOf('=');
  if (at < 1) throw new Error(`--set takes key=value, not "${entry}"`);
  return [entry.slice(0, at).trim(), entry.slice(at + 1).trim()];
}));

/**
 * @param {{ optionsFile?: string, set?: string[] }} options The command options
 * @returns {Record<string, unknown>} option values from the JSON file, then from the --set words
 */
const playerOptionsOf = ({ optionsFile, set = [] }) => ({
  ...(optionsFile ? JSON.parse(readFileSync(optionsFile, 'utf8')) : {}),
  ...optionsOfSets(set),
});

export { playerOptionsOf };
