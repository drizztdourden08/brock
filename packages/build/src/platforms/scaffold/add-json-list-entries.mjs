/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

/**
 * @param {string} file a JSON file such as knip.json or .jscpd.json
 * @param {string} key the top-level array to extend
 * @param {string[]} values
 * @returns {string[]} the values added; none when the file is absent
 */
const addJsonListEntries = (file, key, values) => {
  if (!existsSync(file)) return [];
  const json = JSON.parse(readFileSync(file, 'utf8'));
  const list = Array.isArray(json[key]) ? json[key] : [];
  const added = values.filter((value) => !list.includes(value));
  if (!added.length) return [];
  json[key] = [...list, ...added];
  writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
  return added;
};

export { addJsonListEntries };
