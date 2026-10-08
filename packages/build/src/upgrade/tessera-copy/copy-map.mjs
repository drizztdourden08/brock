/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { TESSERA_BASELINE } from '../tessera/tessera-renames.constants.mjs';
import { TESSERA_ENTRIES } from './tessera-copy.constants.mjs';

const VERSION = /^\d+\.\d+\.\d+$/;

const isRecord = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

const stringMap = (value) => isRecord(value) && Object.values(value).every((item) => typeof item === 'string');

const recordOf = (check) => (value) => isRecord(value) && Object.values(value).every(check);

const unknownEntry = (entries) => Object.values(entries).find((entry) => !TESSERA_ENTRIES.includes(entry));

const entriesProblem = (entries) => {
  if (!stringMap(entries) || Object.keys(entries).length === 0) return '"entries" must map at least one folder of the copy to a Tessera entry point';
  const unknown = unknownEntry(entries);
  return unknown ? `"entries" names "${unknown}", which is not a Tessera entry point (${TESSERA_ENTRIES.join(', ')})` : null;
};

const OPTIONAL = [
  { key: 'from', valid: (value) => typeof value === 'string' && VERSION.test(value), problem: `"from" must be a Tessera version such as ${TESSERA_BASELINE}` },
  { key: 'stylesheets', valid: stringMap, problem: '"stylesheets" must map a stylesheet of the copy to a Tessera stylesheet' },
  { key: 'attributes', valid: recordOf(stringMap), problem: '"attributes" must map a component to the props it gains' },
  { key: 'overlay', valid: recordOf(isRecord), problem: '"overlay" must map a Tessera version to rename maps' },
];

const problemOf = (map) => {
  if (!isRecord(map)) return 'it is not a JSON object';
  const optional = OPTIONAL.find(({ key, valid }) => map[key] !== undefined && !valid(map[key]));
  return optional ? optional.problem : entriesProblem(map.entries);
};

const parsed = (file) => {
  try {
    return { map: JSON.parse(readFileSync(file, 'utf8')) };
  } catch (error) {
    return { refused: `the copy map ${file} is not valid JSON: ${error.message}` };
  }
};

/**
 * @param {string} file the copy map, an absolute path
 * @returns {{ refused: string } | { map: { from: string, entries: Record<string, string>, stylesheets: Record<string, string>, attributes: Record<string, Record<string, string>>, overlay: Record<string, Record<string, any>> } }}
 */
const readCopyMap = (file) => {
  if (!existsSync(file)) return { refused: `the copy map ${file} does not exist` };
  const { map, refused } = parsed(file);
  if (refused) return { refused };
  const problem = problemOf(map);
  if (problem) return { refused: `the copy map ${file} is not usable: ${problem}.` };
  return { map: { from: map.from ?? TESSERA_BASELINE, entries: map.entries, stylesheets: map.stylesheets ?? {}, attributes: map.attributes ?? {}, overlay: map.overlay ?? {} } };
};

export { readCopyMap };
