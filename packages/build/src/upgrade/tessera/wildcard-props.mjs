/* @layer tooling-scripts @kind logic */
import { renameTodos } from './rename-todos.mjs';
import { WILDCARD_KEY } from './tessera-renames.constants.mjs';

const byLongerPrefix = (a, b) => b.prefix.length - a.prefix.length;

const rulesOf = (release) => {
  const rules = new Map();
  for (const [key, value] of Object.entries(release.props ?? {})) {
    const found = WILDCARD_KEY.exec(key);
    if (!found) continue;
    const [, owner, prefix] = found;
    rules.set(owner, [...(rules.get(owner) ?? []), { key, owner, prefix, value: String(value) }]);
  }
  for (const list of rules.values()) list.sort(byLongerPrefix);
  return rules;
};

const keepOf = (release, owner) => {
  const list = release.keep?.[owner];
  return Array.isArray(list) ? new Set(list.map(String)) : null;
};

const ruleFor = (rules, owner, prop) => (rules.get(owner) ?? []).find((rule) => prop.startsWith(rule.prefix)) ?? null;

const todoOf = (version, { rule, prop, sure }) => {
  const head = `${renameTodos.releaseLabel(version)}: the prop ${rule.owner}.${prop} falls under ${rule.key}, which is now "${rule.value}". Change it by hand.`;
  return sure ? head : `${head} Brock could not read the props ${rule.owner} still takes, so check that it dropped ${prop}.`;
};

/**
 * @param {Record<string, any>} release one RENAMES.json release
 * @returns {{ rules: Map<string, { key: string, owner: string, prefix: string, value: string }[]>, ruleFor: (owner: string, prop: string) => { key: string, owner: string, prefix: string, value: string } | null, keep: (owner: string) => Set<string> | null, todo: (found: { rule: Record<string, string>, prop: string, sure: boolean }) => string }} the * props keys by component, longest first
 */
const wildcardProps = (release) => {
  const rules = rulesOf(release);
  return {
    rules,
    ruleFor: (owner, prop) => ruleFor(rules, owner, prop),
    keep: (owner) => keepOf(release, owner),
    todo: (found) => todoOf(release.version, found),
  };
};

export { wildcardProps };
