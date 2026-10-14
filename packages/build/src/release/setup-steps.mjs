/* @layer tooling-scripts @kind logic */
import { fillTemplate } from './fill-template.mjs';
import { stepsBefore } from './render-workflow-step.mjs';
import { CHECKOUT_HISTORY, CHECKOUT_RELEASE, RELEASE_DIR } from './workflows.constants.mjs';

/**
 * @typedef {import('@drizztdourden08/brock-core/module').ModuleCiStep} ModuleCiStep
 * @typedef {import('./check-workflow-step.mjs').CheckedStep} CheckedStep
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
 * @param {{ os: string, release?: boolean, history?: boolean, systemSteps: ModuleCiStep[], appSteps?: CheckedStep[] }} opts appSteps: beforeInstall
 * @returns {string} checkout, system steps, pnpm, Node, install
 */
const setupSteps = ({ os, release = false, history = false, systemSteps, appSteps = [] }) =>
  fillTemplate(RELEASE_DIR, 'setup-steps.yml.tmpl', {
    CHECKOUT: checkoutOf(release, history),
    SYSTEM: `${systemSteps.filter((step) => !step.os || step.os === os).map(renderStep).join('')}${stepsBefore(appSteps)}`,
  }).trimEnd();

export { setupSteps };
