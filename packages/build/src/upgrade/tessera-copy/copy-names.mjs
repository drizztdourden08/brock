/* @layer tooling-scripts @kind logic */
import { IDENTIFIER } from '../tessera/tessera-renames.constants.mjs';

const isName = (value) => typeof value === 'string' && IDENTIFIER.test(value);

const nameOf = (key) => /^[A-Za-z_$][\w$]*/.exec(key)?.[0] ?? key;

const follow = (state, release) => {
  const components = Object.entries(release.components ?? {});
  for (const [key, value] of components) {
    state.copyPart.set(key, true);
    if (!isName(value)) state.noted.add(key);
  }
  for (const [, value] of components.filter(([, value]) => isName(value))) state.copyPart.set(value, false);
  for (const key of Object.keys(release.removedExports ?? {})) state.noted.add(nameOf(key));
  return state;
};

/**
 * @param {Record<string, any>[]} releases the releases replayed, oldest first
 * @param {Map<string, Set<string>>} exports the installed Tessera's entries
 * @returns {{ reused: Set<string>, noted: Set<string> }}
 */
const copyNames = (releases, exports) => {
  const { copyPart, noted } = releases.reduce(follow, { copyPart: new Map(), noted: new Set() });
  const exported = new Set([...exports.values()].flatMap((names) => [...names]));
  const reused = [...copyPart].filter(([name, isCopy]) => isCopy && exported.has(name) && !noted.has(name)).map(([name]) => name);
  return { reused: new Set(reused), noted };
};

export { copyNames };
