/* @layer tooling-scripts @kind logic */
import { resolveModules } from '../modules/resolve.mjs';
import { helperEntries } from './helper-entries.mjs';

/**
 * @param {string} rootDir the app folder
 * @param {import('../config.mjs').BrockConfig} config brock.config.ts
 * @returns {{ name: string, entry: string, packaged: boolean }[]} helpers of the listed modules; packaged when the product opts in
 */
const moduleHelperEntries = (rootDir, config) => {
  const ids = config.modules ?? [];
  if (ids.length === 0) return [];
  return resolveModules(rootDir, ids).modules.flatMap(({ dir, packageName, manifest }) => {
    const packaged = config.product?.moduleOptions?.[manifest.id]?.packaged === true;
    return helperEntries(dir, manifest.helpers, `${packageName} brock.helpers`).map((helper) => ({ ...helper, packaged }));
  });
};

export { moduleHelperEntries };
