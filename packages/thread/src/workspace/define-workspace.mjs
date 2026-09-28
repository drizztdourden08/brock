/* @layer tooling-scripts @kind logic */
import { WORKSPACE_DEFAULTS } from './define-workspace.constants.mjs';

const NAME_RULE = /^[a-z][a-z0-9-]{0,30}$/;

const assertName = (name) => {
  if (typeof name !== 'string' || !NAME_RULE.test(name)) {
    throw new Error(`brock.workspace.mjs: "name" must be a lowercase word (letters, digits, dashes), got "${name ?? ''}".`);
  }
};

const assertTargets = (targets) => {
  for (const [key, target] of Object.entries(targets)) {
    if (typeof target?.launch !== 'function' || !target.kind) throw new Error(`brock.workspace.mjs: target "${key}" is not a launch target (use electronTarget() or serveTarget()).`);
  }
};

/**
 * @param {Partial<import('./workspace.type.mjs').Workspace> & { name: string }} config
 * @returns {import('./workspace.type.mjs').Workspace}
 */
const defineWorkspace = (config) => {
  assertName(config.name);
  const workspace = {
    ...WORKSPACE_DEFAULTS,
    ...config,
    build: { ...WORKSPACE_DEFAULTS.build, ...(config.build ?? {}) },
    publish: { ...WORKSPACE_DEFAULTS.publish, ...(config.publish ?? {}) },
    protectedBranches: [...new Set([...(config.protectedBranches ?? []), config.base ?? WORKSPACE_DEFAULTS.base, ...WORKSPACE_DEFAULTS.protectedBranches])],
  };
  assertTargets(workspace.targets);
  return Object.freeze(workspace);
};

export { defineWorkspace };
