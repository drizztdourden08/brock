/* @layer tooling-scripts @kind logic */
import {
  BASELINE_MODE, BASELINE_REVIEW_DATA, BASELINE_SCREEN, BASELINE_SET, BLESS_INPUT, PLAIN_REVIEW_DATA, REVIEW_COMMAND,
} from './review-job.constants.mjs';

const blessSteps = (suffix) => [
  '',
  '',
  '      - name: Keep the blessed baselines',
  '        if: always() && inputs.bless',
  '        uses: actions/upload-artifact@v7',
  '        with:',
  `          name: review-baselines${suffix}`,
  `          path: \${{ env.APP_DIR }}/${BASELINE_SET}/`,
  '          if-no-files-found: error',
].join('\n');

/**
 * @param {{ baselines: boolean, app: { name: string } | null }} input
 * @returns {Record<string, string>} the review placeholders of the CI templates
 */
const reviewJobValues = ({ baselines, app }) => (baselines
  ? {
    DISPATCH_INPUTS: BLESS_INPUT,
    REVIEW_RUN: `xvfb-run -a -s "${BASELINE_SCREEN}" ${REVIEW_COMMAND} ${BASELINE_MODE}`,
    BASELINE_STEPS: blessSteps(app ? `-${app.name}` : ''),
    REVIEW_DATA: BASELINE_REVIEW_DATA,
  }
  : { DISPATCH_INPUTS: '', REVIEW_RUN: `xvfb-run -a ${REVIEW_COMMAND}`, BASELINE_STEPS: '', REVIEW_DATA: PLAIN_REVIEW_DATA });

export { reviewJobValues };
