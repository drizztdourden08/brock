/* @layer tooling-scripts @kind logic */
import { TESSERA_PACKAGE } from './tessera-renames.constants.mjs';

const isSubpath = (value) => typeof value === 'string' && value !== '' && !value.startsWith('.') && !value.startsWith('/');

const entryOf = (subpath) => `${TESSERA_PACKAGE}/${subpath}`;

/**
 * @param {Record<string, any>} release one RENAMES.json release
 * @returns {{ from: string, to: string, names: Set<string> }[]} its moves grouped by entry pair; the root import never moves
 */
const releaseMoves = (release) => {
  const groups = new Map();
  for (const [name, move] of Object.entries(release.moves ?? {})) {
    if (!isSubpath(move?.from) || !isSubpath(move?.to) || move.from === move.to) continue;
    const key = `${move.from}\n${move.to}`;
    if (!groups.has(key)) groups.set(key, { from: entryOf(move.from), to: entryOf(move.to), names: new Set() });
    groups.get(key).names.add(name);
  }
  return [...groups.values()];
};

export { releaseMoves };
