/* @layer tooling-scripts @kind logic */

/**
 * @param {import('./scan-screens.mjs').ScreenFile[]} files
 * @returns {string[]} page meta files with no tab folder beside them
 */
const pageMetaFindings = (files) => files
  .filter((file) => file.kind === 'page-meta')
  .filter((meta) => !files.some((file) => file.kind === 'tab' && file.bucket === meta.bucket && file.group === meta.group && file.page === meta.id))
  .map((meta) => `${meta.path}: no ${meta.id}/ tab folder beside it; a .page.ts file holds the meta of the tab page in that folder`);

export { pageMetaFindings };
