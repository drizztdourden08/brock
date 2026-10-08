/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathInside } from '../design/path-inside.mjs';
import { MANAGED_FILES } from '../../managed/templates.mjs';
import { ownedFiles } from '../owned-files.mjs';
import { ALIAS_CONFIG } from './tessera-copy.constants.mjs';

const FOLDER_NOTE = 'the copy of the design system. Once nothing imports it, delete its primitives, composites and data. Move what the app keeps from it first (tokens only this app uses, such as game text styles, and its own fonts) into the app theme, as Tessera\'s MIGRATION.md says, then remove the alias.';

const mentionsOf = (text, needles) =>
  text.split('\n').flatMap((line, index) => (needles.some((needle) => line.includes(needle)) ? [index + 1] : []));

/**
 * @param {string} rootDir
 * @param {{ copyDir: string, aliases: string[] }} copy
 * @returns {{ file: string, line: number | null, message: string }[]} alias lines, then the folder
 */
const copyLeftovers = (rootDir, { copyDir, aliases }) => {
  const folder = relative(rootDir, copyDir).replace(/\\/g, '/');
  const needles = [...aliases.flatMap((alias) => [`'${alias}`, `"${alias}`]), folder];
  const managed = MANAGED_FILES.map(({ target }) => target).filter((file) => existsSync(join(rootDir, file)));
  const configs = [...new Set([...managed, ...ownedFiles(rootDir)])].sort().filter((file) => ALIAS_CONFIG.test(file) && !pathInside(join(rootDir, file), copyDir));
  const lines = configs.flatMap((file) => mentionsOf(readFileSync(join(rootDir, file), 'utf8'), needles).map((line) => ({
    file,
    line,
    message: `maps ${aliases.length ? aliases.join(' or ') : 'a path'} to the copy of the design system, or names its folder. Remove it once the copy is gone.`,
  })));
  return [...lines, { file: folder, line: null, message: FOLDER_NOTE }];
};

export { copyLeftovers };
