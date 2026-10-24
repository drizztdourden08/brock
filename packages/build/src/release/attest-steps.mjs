/* @layer tooling-scripts @kind logic */
import { resolvePlatforms } from '../platforms/resolve-platforms.mjs';
import {
  APP_ATTEST_LABEL, ATTEST_ACTION, ATTEST_BUNDLE_SUFFIX, ATTEST_JOB, ATTEST_PERMISSIONS, ATTEST_STAGES, ATTEST_STEP_ID,
} from './workflow-steps.constants.mjs';

/**
 * @typedef {import('@drizztdourden08/brock-core/module').WorkflowAttest} WorkflowAttest
 * @typedef {import('@drizztdourden08/brock-core/module').WorkflowSteps} WorkflowSteps
 */

const BUNDLE_SCRIPT = [
  'shopt -s globstar nullglob',
  'while IFS= read -r pattern; do',
  '  for file in $pattern; do',
  `    case "$file" in *${ATTEST_BUNDLE_SUFFIX}) continue ;; esac`,
  `    if [ -f "$file" ]; then cp "$BUNDLE_PATH" "$file${ATTEST_BUNDLE_SUFFIX}"; fi`,
  '  done',
  'done <<< "$ATTEST_PATHS"',
].join('\n');

const fail = (message) => {
  throw new Error(`${APP_ATTEST_LABEL}: ${message}`);
};

const assertAttest = (attest) => {
  if (typeof attest !== 'object' || attest === null || Array.isArray(attest)) fail('takes { paths: string[], stage }.');
  const unknown = Object.keys(attest).filter((key) => key !== 'paths' && key !== 'stage');
  if (unknown.length) fail(`unknown key ${unknown.join(', ')}; it takes paths and stage.`);
  if (!ATTEST_STAGES.includes(attest.stage)) fail(`stage takes ${ATTEST_STAGES.join(' or ')}; got ${JSON.stringify(attest.stage)}.`);
  const { paths } = attest;
  if (!Array.isArray(paths) || !paths.length || paths.some((path) => typeof path !== 'string' || !path.trim() || path.includes('\n'))) {
    fail('paths is a list of file paths or globs, each a non-empty single-line string.');
  }
};

/**
 * @param {WorkflowAttest | undefined} attest
 * @param {string[]} targets
 * @returns {WorkflowSteps | null} the attest and bundle steps
 */
const attestSteps = (attest, targets) => {
  if (attest === undefined || attest === null) return null;
  assertAttest(attest);
  if (!resolvePlatforms(targets).platforms.some((platform) => `build-${platform.id}` === ATTEST_JOB)) {
    fail(`attests in the ${ATTEST_JOB} job, and the targets build no linux platform.`);
  }
  const where = { os: 'linux', platforms: ['linux'], jobs: [ATTEST_JOB] };
  return {
    release: {
      [attest.stage]: [
        {
          ...where,
          name: 'Attest the release files',
          id: ATTEST_STEP_ID,
          uses: ATTEST_ACTION,
          with: { 'subject-path': attest.paths.join('\n') },
          permissions: { ...ATTEST_PERMISSIONS },
        },
        {
          ...where,
          name: 'Write the attestation bundles',
          shell: 'bash',
          env: { BUNDLE_PATH: `\${{ steps.${ATTEST_STEP_ID}.outputs.bundle-path }}`, ATTEST_PATHS: attest.paths.join('\n') },
          run: BUNDLE_SCRIPT,
        },
      ],
    },
  };
};

export { attestSteps };
