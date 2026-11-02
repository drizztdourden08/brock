/* @layer tooling-scripts @kind logic */
import { BUCKET_FILE_KINDS, SCREENS_DIR } from './screen-conventions.constants.mjs';

/** @param {import('./scan-screens.mjs').ScreenFile} file */
const pageKey = (file) => `${file.group ?? ''}/${file.kind === 'tab' || file.kind === 'sub' ? file.page : file.id}`;

/** @param {string[]} ids */
const repeated = (ids) => [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];

/**
 * @param {import('./scan-screens.mjs').ScreenFile[]} files
 * @param {string[]} buckets
 * @returns {string[]}
 */
const layoutFindings = (files, buckets) => buckets.flatMap((bucket) => {
  const at = `${SCREENS_DIR}/${bucket}`;
  const own = files.filter((file) => file.bucket === bucket && !BUCKET_FILE_KINDS.includes(file.kind));
  const misnamed = files.filter((file) => file.bucket === bucket && BUCKET_FILE_KINDS.includes(file.kind) && file.id !== bucket);
  const heroes = own.filter((file) => file.kind === 'hero').map((file) => file.path.split('/').at(-1));
  const pageIds = [...new Set(own.map(pageKey))].map((key) => key.split('/')[1]);
  return [
    ...(own.length === 0 ? [`${at}: a bucket folder with no screens`] : []),
    ...(heroes.length > 1 ? [`${at}: two homes (${heroes.join(', ')}); a bucket has one .hero.tsx`] : []),
    ...misnamed.map((file) => `${file.path}: a bucket ${file.kind} takes the bucket name; rename it ${bucket}.${file.kind}.tsx`),
    ...repeated(pageIds).map((id) => `${at}: two pages named "${id}"; a page id is unique in its bucket`),
  ];
});

export { layoutFindings };
