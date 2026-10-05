/* @layer tooling-scripts @kind logic */
import { GENERATED_HEADER } from '../boot/boot.constants.mjs';
import { FIXTURES_DIR, REVIEW_DIR, REVIEW_FROM, REVIEW_NAME, REVIEW_OUTPUT, REVIEW_SEED, STEP_SUFFIX } from './review.constants.mjs';
import { scanReview } from './scan-review.mjs';

const moduleOf = (file) => `../${REVIEW_DIR}/${file.replace(/\.ts$/, '')}`;

const quoted = (text) => `'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

const fixtureLines = (fixtures) => (fixtures.length
  ? ['  fixtures: [', ...fixtures.map((path) => `    { path: ${quoted(path)}, load: () => import(${quoted(`../${REVIEW_DIR}/${FIXTURES_DIR}/${path}?url`)}) },`), '  ],']
  : ['  fixtures: [],']);

/**
 * @param {{ seed: boolean, steps: string[], fixtures: string[] }} review
 * @returns {string}  The content of .brock/review.ts
 */
const renderReview = ({ seed, steps, fixtures }) => {
  const seedLine = `  seed: ${seed ? `() => import('${moduleOf(REVIEW_SEED)}')` : 'null'},`;
  const stepLines = steps.length
    ? ['  steps: [', ...steps.map((id) => `    { id: '${id}', load: () => import('${moduleOf(`${id}${STEP_SUFFIX}`)}') },`), '  ],']
    : ['  steps: [],'];
  return [GENERATED_HEADER, `import type { AppReview } from '${REVIEW_FROM}';`, '', `const ${REVIEW_NAME}: AppReview = {`, seedLine, ...stepLines, ...fixtureLines(fixtures), '};', '', `export { ${REVIEW_NAME} };`, ''].join('\n');
};

/**
 * @param {string} rootDir  The app root
 * @returns {{ path: string, content: string }[]}  .brock/review.ts, always
 */
const renderReviewFiles = (rootDir) => [{ path: REVIEW_OUTPUT, content: renderReview(scanReview(rootDir)) }];

export { renderReviewFiles };
