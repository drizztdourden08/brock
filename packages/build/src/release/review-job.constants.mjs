/* @layer tooling-scripts @kind constants */
const REVIEW_COMMAND = 'pnpm --dir "$APP_DIR" exec brock launch main none --prod --review';

const PLAIN_REVIEW = Object.freeze({
  DISPATCH_INPUTS: '',
  REVIEW_RUNNER: 'ubuntu-latest',
  REVIEW_RUN: `xvfb-run -a ${REVIEW_COMMAND}`,
  BASELINE_STEPS: '',
});

const BASELINE_RUNNER = 'ubuntu-24.04';
const BASELINE_SCREEN = '-screen 0 1920x1080x24';
const BASELINE_SET = 'tests/baselines/linux';
const BASELINE_MODE = "${{ inputs.bless && '--review-bless' || '--review-baselines' }}";

const BASELINE_REVIEW = Object.freeze({
  DISPATCH_INPUTS: [
    '',
    '    inputs:',
    '      bless:',
    '        description: Store the review captures as the linux baselines and keep them as the review-baselines artifact',
    '        type: boolean',
    '        default: false',
  ].join('\n'),
  REVIEW_RUNNER: BASELINE_RUNNER,
  REVIEW_RUN: `xvfb-run -a -s "${BASELINE_SCREEN}" ${REVIEW_COMMAND} ${BASELINE_MODE}`,
  BASELINE_STEPS: [
    '',
    '',
    '      - name: Keep the blessed baselines',
    '        if: always() && inputs.bless',
    '        uses: actions/upload-artifact@v4',
    '        with:',
    '          name: review-baselines',
    `          path: \${{ env.APP_DIR }}/${BASELINE_SET}/`,
    '          if-no-files-found: error',
  ].join('\n'),
});

export { BASELINE_REVIEW, PLAIN_REVIEW };
