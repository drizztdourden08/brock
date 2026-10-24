/* @layer tooling-scripts @kind logic */
import { PERMISSION_LEVELS, RELEASE_BASE_PERMISSIONS } from './workflow-steps.constants.mjs';

/**
 * @param {Record<string, string>[]} maps
 * @returns {Record<string, string>} every permission once, the higher level winning
 */
const mergePermissions = (...maps) => {
  const merged = {};
  for (const map of maps) {
    for (const [name, level] of Object.entries(map)) {
      if (!(name in merged) || PERMISSION_LEVELS[level] > PERMISSION_LEVELS[merged[name]]) merged[name] = level;
    }
  }
  return merged;
};

const linesOf = (permissions) => Object.entries(permissions)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, level]) => `      ${name}: ${level}`)
  .join('\n');

/**
 * @param {Record<string, string> | undefined} lifted the permissions the steps of one job asked for
 * @returns {string} the job permissions block
 */
const jobPermissionsBlock = (lifted) => (lifted && Object.keys(lifted).length
  ? `\n    permissions:\n${linesOf(mergePermissions(RELEASE_BASE_PERMISSIONS, lifted))}`
  : '');

/**
 * @param {string} text a job block with a runs-on line
 * @param {Record<string, string> | undefined} lifted
 * @returns {string} the job with its own permissions after runs-on
 */
const withJobPermissions = (text, lifted) => {
  const block = jobPermissionsBlock(lifted);
  return block ? text.replace(/^( {4}runs-on: .*)$/m, `$1${block}`) : text;
};

export { mergePermissions, jobPermissionsBlock, withJobPermissions };
