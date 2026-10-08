/* @layer tooling-scripts @kind logic */
import { fillTemplate } from './fill-template.mjs';
import { CHECKOUT_HISTORY, CHECKOUT_RELEASE, RELEASE_DIR } from './workflows.constants.mjs';

/**
 * @typedef {import('@drizztdourden08/brock-core/module').ModuleCiStep} ModuleCiStep
 */

/**
 * @param {ModuleCiStep} step
 */
const renderStep = (step) => `      - name: ${JSON.stringify(step.name)}\n        run: ${JSON.stringify(step.run)}\n\n`;

const checkoutOf = (release, history) => {
  if (release) return CHECKOUT_RELEASE;
  return history ? CHECKOUT_HISTORY : '';
};

/**
 * @param {{ os: string, release?: boolean, history?: boolean, systemSteps: ModuleCiStep[] }} opts
 * @returns {string} checkout, module system steps, pnpm, Node, install
 */
const setupSteps = ({ os, release = false, history = false, systemSteps }) =>
  fillTemplate(RELEASE_DIR, 'setup-steps.yml.tmpl', {
    CHECKOUT: checkoutOf(release, history),
    SYSTEM: systemSteps.filter((step) => !step.os || step.os === os).map(renderStep).join(''),
  }).trimEnd();

export { setupSteps };
