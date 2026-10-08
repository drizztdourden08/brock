/* @layer tooling-scripts @kind logic */
import { join, relative, resolve } from 'node:path';
import { pathInside } from '../design/path-inside.mjs';

const aliasOf = (spec, aliases) => aliases.find((alias) => spec === alias || spec.startsWith(`${alias}/`)) ?? null;

const targetPath = (spec, { fileDir, copyDir, aliases }) => {
  if (spec.startsWith('.')) return resolve(fileDir, spec);
  const alias = aliasOf(spec, aliases);
  return alias === null ? null : join(copyDir, spec.slice(alias.length));
};

const entryOf = (inner, entries) => {
  const folders = Object.keys(entries).filter((folder) => inner === folder || inner.startsWith(`${folder}/`));
  const deepest = folders.sort((a, b) => b.length - a.length)[0];
  return deepest === undefined ? null : entries[deepest];
};

/**
 * @param {string} spec a module specifier or a path in a string
 * @param {{ fileDir: string, copyDir: string, aliases: string[], map: { entries: Record<string, string>, stylesheets: Record<string, string> } }} place the folder of the file that holds it
 * @returns {{ inner: string, entry: string | null, stylesheet: string | null } | null} where it points inside the copy; null outside it
 */
const copyTarget = (spec, place) => {
  const target = targetPath(spec, place);
  if (target === null || !pathInside(target, place.copyDir)) return null;
  const inner = relative(place.copyDir, target).replace(/\\/g, '/');
  return { inner, entry: entryOf(inner, place.map.entries), stylesheet: Object.hasOwn(place.map.stylesheets, inner) ? place.map.stylesheets[inner] : null };
};

export { copyTarget };
