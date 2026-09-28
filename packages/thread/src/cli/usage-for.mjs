/* @layer tooling-scripts @kind logic */

/**
 * @param {string} usage lines that start with `brock `
 * @param {import('../workspace/workspace.type.mjs').Workspace} workspace
 * @returns {string} the same lines under the workspace's own command
 */
const usageFor = (usage, workspace) => usage.replace(/^(\s*)brock /gm, `$1${workspace.name} `);

export { usageFor };
