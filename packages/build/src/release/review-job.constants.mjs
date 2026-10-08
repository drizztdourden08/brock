/* @layer tooling-scripts @kind constants */
const REVIEW_COMMAND = 'pnpm --dir "$APP_DIR" exec brock launch main none --prod --review';
const PLAIN_RUNNER = 'ubuntu-latest';
const PLAIN_REVIEW_DATA = '.user-data';

const BASELINE_RUNNER = 'ubuntu-24.04';
const BASELINE_SCREEN = '-screen 0 1920x1080x24';
const BASELINE_SET = 'tests/baselines/linux';
const BASELINE_MODE = "${{ inputs.bless && '--review-bless' || '--review-baselines' }}";
const BASELINE_REVIEW_DATA = '.user-data-review';

const BLESS_INPUT = [
  '',
  '    inputs:',
  '      bless:',
  '        description: Store the review captures as the linux baselines and keep them as the review-baselines artifact',
  '        type: boolean',
  '        default: false',
].join('\n');

export {
  BASELINE_MODE, BASELINE_REVIEW_DATA, BASELINE_RUNNER, BASELINE_SCREEN, BASELINE_SET, BLESS_INPUT, PLAIN_REVIEW_DATA, PLAIN_RUNNER, REVIEW_COMMAND,
};
