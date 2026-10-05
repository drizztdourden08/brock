/* @layer tooling-scripts @kind logic */
import { PROP_PATHS, WILDCARD_KEY } from './tessera-renames.constants.mjs';
import { renameValue } from './rename-value.mjs';

const sameOwner = (from, to, components) => to.component === from.component || components[from.component] === to.component;

const renameOf = (from, value, components) => {
  if (renameValue.propName(value)) return value;
  const to = renameValue.propPath(value);
  return to && sameOwner(from, to, components) ? to.prop : null;
};

const propEntries = ([key, value], components) => {
  if (WILDCARD_KEY.test(key)) return [];
  const from = renameValue.propPath(key);
  if (from) return [[key, { key, value, rename: renameOf(from, value, components) }]];
  return [...key.matchAll(PROP_PATHS)].map(([path]) => [path, { key, value, rename: null }]);
};

/**
 * @param {Record<string, any>} release
 * @returns {Map<string, { key: string, value: string, rename: string | null }>} by Component.prop; null rename is a to-do, no * keys
 */
const propRules = (release) =>
  new Map(Object.entries(release.props ?? {}).flatMap((entry) => propEntries(entry, release.components ?? {})));

export { propRules };
