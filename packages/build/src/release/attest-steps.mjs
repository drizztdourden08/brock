/* @layer tooling-scripts @kind logic */
import { resolvePlatforms } from '../platforms/resolve-platforms.mjs';
import {
  APP_ATTEST_LABEL, ATTEST_ACTION, ATTEST_BUNDLE_SUFFIX, ATTEST_FILE_SLOTS, ATTEST_JOB, ATTEST_LIST_FILE, ATTEST_LIST_ID, ATTEST_PERMISSIONS, ATTEST_STAGES,
  ATTEST_STEP_ID,
} from './workflow-steps.constants.mjs';

/**
 * @typedef {import('@drizztdourden08/brock-core/module').WorkflowAttest} WorkflowAttest
 * @typedef {import('@drizztdourden08/brock-core/module').WorkflowSteps} WorkflowSteps
 */

const ATTEST_KEYS = Object.freeze(['paths', 'stage', 'perFile']);

const BUNDLE_SCRIPT = [
  'shopt -s globstar nullglob',
  'while IFS= read -r pattern; do',
  '  for file in $pattern; do',
  `    case "$file" in *${ATTEST_BUNDLE_SUFFIX}) continue ;; esac`,
  `    if [ -f "$file" ]; then cp "$BUNDLE_PATH" "$file${ATTEST_BUNDLE_SUFFIX}"; fi`,
  '  done',
  'done <<< "$ATTEST_PATHS"',
].join('\n');

const LIST_SCRIPT = [
  'shopt -s globstar nullglob',
  'declare -A seen',
  'files=()',
  'while IFS= read -r pattern; do',
  '  for file in $pattern; do',
  `    case "$file" in *${ATTEST_BUNDLE_SUFFIX}) continue ;; esac`,
  '    if [ -f "$file" ] && [ -z "${seen[$file]:-}" ]; then seen[$file]=1; files+=("$file"); fi',
  '  done',
  'done <<< "$ATTEST_PATHS"',
  'if [ "${#files[@]}" -eq 0 ]; then echo "::error::No file matches workflows.attest.paths."; exit 1; fi',
  `if [ "\${#files[@]}" -gt ${ATTEST_FILE_SLOTS} ]; then echo "::error::workflows.attest.perFile attests up to ${ATTEST_FILE_SLOTS} files, and \${#files[@]} match."; exit 1; fi`,
  `printf '%s\\n' "\${files[@]}" > "${ATTEST_LIST_FILE}"`,
  'i=0',
  'for file in "${files[@]}"; do i=$((i + 1)); echo "file-$i=$file" >> "$GITHUB_OUTPUT"; done',
].join('\n');

const SLOT_BUNDLE_SCRIPT = [
  'i=0',
  'while IFS= read -r file; do',
  '  i=$((i + 1))',
  '  var="BUNDLE_$i"',
  `  cp "\${!var}" "$file${ATTEST_BUNDLE_SUFFIX}"`,
  `done < "${ATTEST_LIST_FILE}"`,
].join('\n');

const fail = (message) => {
  throw new Error(`${APP_ATTEST_LABEL}: ${message}`);
};

const assertPaths = (paths) => {
  if (!Array.isArray(paths) || !paths.length || paths.some((path) => typeof path !== 'string' || !path.trim() || path.includes('\n'))) {
    fail('paths is a list of file paths or globs, each a non-empty single-line string.');
  }
};

const assertAttest = (attest) => {
  if (typeof attest !== 'object' || attest === null || Array.isArray(attest)) fail('takes { paths: string[], stage, perFile?: boolean }.');
  const unknown = Object.keys(attest).filter((key) => !ATTEST_KEYS.includes(key));
  if (unknown.length) fail(`unknown key ${unknown.join(', ')}; it takes ${ATTEST_KEYS.join(', ')}.`);
  if (!ATTEST_STAGES.includes(attest.stage)) fail(`stage takes ${ATTEST_STAGES.join(' or ')}; got ${JSON.stringify(attest.stage)}.`);
  if (attest.perFile !== undefined && typeof attest.perFile !== 'boolean') fail(`perFile takes true or false; got ${JSON.stringify(attest.perFile)}.`);
  assertPaths(attest.paths);
};

const allFilesSteps = (attest, where) => [
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
];

const slotIds = Array.from({ length: ATTEST_FILE_SLOTS }, (_, at) => at + 1);

const perFileSteps = (attest, where) => [
  {
    ...where, name: 'List the release files to attest', id: ATTEST_LIST_ID, shell: 'bash', env: { ATTEST_PATHS: attest.paths.join('\n') }, run: LIST_SCRIPT,
  },
  ...slotIds.map((slot) => ({
    ...where,
    name: `Attest release file ${slot}`,
    id: `${ATTEST_STEP_ID}-${slot}`,
    if: `steps.${ATTEST_LIST_ID}.outputs.file-${slot} != ''`,
    uses: ATTEST_ACTION,
    with: { 'subject-path': `\${{ steps.${ATTEST_LIST_ID}.outputs.file-${slot} }}` },
    permissions: { ...ATTEST_PERMISSIONS },
  })),
  {
    ...where,
    name: 'Write the attestation bundles',
    shell: 'bash',
    env: Object.fromEntries(slotIds.map((slot) => [`BUNDLE_${slot}`, `\${{ steps.${ATTEST_STEP_ID}-${slot}.outputs.bundle-path }}`])),
    run: SLOT_BUNDLE_SCRIPT,
  },
];

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
  return { release: { [attest.stage]: attest.perFile ? perFileSteps(attest, where) : allFilesSteps(attest, where) } };
};

export { attestSteps };
