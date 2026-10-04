/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { BROCK_PACKAGE, WORKSPACE_FILE } from './upgrade.constants.mjs';

const ENTRY_LINE = /^(?<key>[ \t]+(?<quote>['"]?)(?<name>@[\w.-]+\/[\w.-]+)\k<quote>:[ \t]*)(?<specQuote>['"]?)(?<spec>[\^~]?\d[^\s'"]*)\k<specQuote>(?<tail>[ \t]*)$/gm;

/**
 * @param {string} rootDir the workspace root
 * @param {string} version the Brock version every catalog entry moves to
 * @returns {string[]} the catalog fields changed
 */
const followBrockCatalog = (rootDir, version) => {
  const file = join(rootDir, WORKSPACE_FILE);
  if (!existsSync(file)) return [];
  const changed = [];
  const text = readFileSync(file, 'utf8');
  const next = text.replace(ENTRY_LINE, (...match) => {
    const { key, name, specQuote, spec, tail } = match.at(-1);
    if (!BROCK_PACKAGE.test(name) || spec === `^${version}`) return match[0];
    changed.push(`catalog.${name}`);
    return `${key}${specQuote}^${version}${specQuote}${tail}`;
  });
  if (changed.length > 0) writeFileSync(file, next, 'utf8');
  return changed;
};

export { followBrockCatalog };
