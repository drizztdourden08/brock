/* @layer tooling-scripts @kind logic */

/** @param {import('./scan-screens.mjs').ScreenFile} sub @param {import('./scan-screens.mjs').ScreenFile} file */
const isPageOf = (sub, file) => file.bucket === sub.bucket && file.group === sub.group
  && ((file.kind === 'tab' && file.page === sub.page) || ((file.kind === 'page' || file.kind === 'custom') && file.id === sub.page));

/**
 * @param {import('./scan-screens.mjs').ScreenFile[]} files
 * @returns {string[]} sub-pages with no page of their own
 */
const subPageFindings = (files) => files
  .filter((file) => file.kind === 'sub')
  .filter((sub) => !files.some((file) => isPageOf(sub, file)))
  .map((sub) => `${sub.path}: no page "${sub.page}" for this sub-page; add ${sub.page}.page.tsx beside the ${sub.page}/ folder, or tabs inside it`);

export { subPageFindings };
