/* @layer tooling-scripts @kind logic */
import { join, relative, resolve } from 'node:path';
import { pathInside } from '../design/path-inside.mjs';
import { COPY_ENTRIES, COPY_STYLESHEETS } from './tessera-copy.constants.mjs';

const aliasOf = (spec, aliases) => aliases.find((alias) => spec === alias || spec.startsWith(`${alias}/`)) ?? null;

const targetPath = (spec, { fileDir, copyDir, aliases }) => {
  if (spec.startsWith('.')) return resolve(fileDir, spec);
  const alias = aliasOf(spec, aliases);
  return alias === null ? null : join(copyDir, spec.slice(alias.length));
};

const entryOf = (inner) => COPY_ENTRIES.find(({ folder }) => inner === folder || inner.startsWith(`${folder}/`))?.entry ?? null;

/**
 * @param {string} spec a module specifier or a path in a string
 * @param {{ fileDir: string, copyDir: string, aliases: string[] }} place the folder of the file that holds it
 * @returns {{ inner: string, entry: string | null, stylesheet: string | null } | null} where it points inside the copy; null outside it
 */
const copyTarget = (spec, place) => {
  const target = targetPath(spec, place);
  if (target === null || !pathInside(target, place.copyDir)) return null;
  const inner = relative(place.copyDir, target).replace(/\\/g, '/');
  return { inner, entry: entryOf(inner), stylesheet: COPY_STYLESHEETS[inner] ?? null };
};

export { copyTarget };
