/* @layer tooling-scripts @kind logic */
import { renameValue } from './rename-value.mjs';

const renameOf = (owner, value, components) => {
  if (renameValue.propName(value)) return value;
  const to = renameValue.propPath(value);
  return to && (to.component === owner || components[owner] === to.component) ? to.prop : null;
};

/**
 * @param {Record<string, any>} release
 * @returns {Map<string, { key: string, owner: string, value: string, rename: string | null }[]>} by the old property name; null rename is a to-do
 */
const propertyRules = (release) => {
  const rules = new Map();
  for (const [key, value] of Object.entries(release.props ?? {})) {
    const from = renameValue.propPath(key);
    if (!from) continue;
    const rule = { key, owner: from.component, value, rename: renameOf(from.component, value, release.components ?? {}) };
    rules.set(from.prop, [...(rules.get(from.prop) ?? []), rule]);
  }
  return rules;
};

export { propertyRules };
