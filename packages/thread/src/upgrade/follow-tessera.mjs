/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { jsonFile } from '../provision/json-file.mjs';
import { CATALOG_SPEC, DEPENDENCY_BLOCKS, LOCAL_SPEC, TESSERA_PACKAGE } from './upgrade.constants.mjs';

const CATALOG_LINE = new RegExp(String.raw`^([ \t]+['"]?${TESSERA_PACKAGE.replace('/', String.raw`\/`)}['"]?:[ \t]*)(\S+)[ \t]*$`, 'm');
const unquoted = (spec) => spec.replace(/^['"]|['"]$/g, '');

const followCatalog = (dir, range) => {
  const file = join(dir, 'pnpm-workspace.yaml');
  if (!existsSync(file)) return [];
  const text = readFileSync(file, 'utf8');
  const spec = text.match(CATALOG_LINE)?.[2];
  if (spec === undefined || unquoted(spec) === range || LOCAL_SPEC.test(unquoted(spec))) return [];
  writeFileSync(file, text.replace(CATALOG_LINE, `$1${range}`), 'utf8');
  return [`catalog.${TESSERA_PACKAGE}`];
};

/**
 * @param {string} dir the app (or workspace root) folder
 * @param {string | null} range brock-react's Tessera peer range at the target
 * @returns {string[]} the fields changed
 */
const followTessera = (dir, range) => {
  if (!range || range === '*') return [];
  const file = jsonFile(join(dir, 'package.json'));
  const pkg = file.read() ?? {};
  const block = DEPENDENCY_BLOCKS.find((name) => typeof pkg[name]?.[TESSERA_PACKAGE] === 'string');
  if (!block) return [];
  const spec = pkg[block][TESSERA_PACKAGE];
  if (spec === CATALOG_SPEC) return followCatalog(dir, range);
  if (LOCAL_SPEC.test(spec) || spec === range) return [];
  file.write({ ...pkg, [block]: { ...pkg[block], [TESSERA_PACKAGE]: range } });
  return [`${block}.${TESSERA_PACKAGE}`];
};

export { followTessera };
