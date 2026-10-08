/* @layer tooling-scripts @kind logic */
import { SCREENS_DIR } from './screen-conventions.constants.mjs';

/** @param {import('./scan-screens.mjs').ScreenFile} file @param {import('./scan-screens.mjs').ScreenFile} child */
const isPageOf = (file, child) => file.bucket === child.bucket && file.group === child.group
  && ((file.kind === 'tab' && file.page === child.page) || ((file.kind === 'page' || file.kind === 'custom') && file.id === child.page));

/**
 * @param {import('./scan-screens.mjs').ScreenFile[]} files
 * @param {string[]} buckets
 * @returns {string[]} what a production build would leave broken
 */
const devScreenFindings = (files, buckets) => {
  const shipped = files.filter((file) => !file.dev);
  const allDev = buckets.filter((bucket) => files.some((file) => file.bucket === bucket) && !shipped.some((file) => file.bucket === bucket && file.kind !== 'page-meta'));
  const orphans = shipped.filter((file) => (file.kind === 'sub' || file.kind === 'tab') && files.some((page) => page.dev && isPageOf(page, file)) && !shipped.some((page) => isPageOf(page, file)));
  return [
    ...allDev.map((bucket) => `${SCREENS_DIR}/${bucket}: every screen of this bucket is dev-only, so a production build would have an empty bucket; add a page or a hero that ships, or make the screens dev-only cards`),
    ...orphans.map((file) => `${file.path}: its page "${file.page}" is dev-only, so a production build has this ${file.kind} with no page; make it dev-only too`),
  ];
};

export { devScreenFindings };
