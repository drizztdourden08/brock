/* @layer tooling-scripts @kind logic */
const NAME_RULE = /^[a-z][a-z0-9-]{0,30}$/;

const assertVerbs = (name, verbs) => {
  for (const [key, verb] of Object.entries(verbs)) {
    if (typeof verb?.run !== 'function' || typeof verb.usage !== 'string') {
      throw new Error(`plugin "${name}": verb "${key}" needs { run(positional, options, ctx), usage }.`);
    }
  }
};

/**
 * @param {Partial<import('../workspace/workspace.type.mjs').Plugin> & { name: string }} plugin
 * @returns {import('../workspace/workspace.type.mjs').Plugin}
 */
const assertPluginName = (name) => {
  if (typeof name !== 'string' || !NAME_RULE.test(name)) throw new Error(`definePlugin: "name" must be a lowercase word, got "${name ?? ''}".`);
};

const stepsOf = (steps = {}) => ({ provision: steps.provision ?? [], build: steps.build ?? [] });

const definePlugin = (plugin) => {
  assertPluginName(plugin?.name);
  const { name, verbs = {}, targets = {}, guards = [], steps } = plugin;
  assertVerbs(name, verbs);
  return Object.freeze({ name, verbs, targets, steps: stepsOf(steps), guards });
};

export { definePlugin };
