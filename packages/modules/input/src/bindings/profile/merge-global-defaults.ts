/* @layer core @kind logic */
import type { ActionBinding } from '../bindings.type';

const mergeGlobalDefaults = (
  saved: readonly ActionBinding[] | undefined,
  defaults: readonly ActionBinding[],
): ActionBinding[] => {
  if (!saved || saved.length === 0) return [...defaults];
  const existing = new Set(saved.map((mapping) => mapping.action));
  const missing = defaults.filter((def) => !existing.has(def.action));
  return [...saved, ...missing];
};

export { mergeGlobalDefaults };
