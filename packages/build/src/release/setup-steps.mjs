/* @layer tooling-scripts @kind logic */
import { fillTemplate } from './fill-template.mjs';
import { CHECKOUT_TAG, RELEASE_DIR } from './workflows.constants.mjs';

/**
 * @typedef {import('@drizztdourden08/brock-core/module').ModuleCiStep} ModuleCiStep
 */

/**
 * @param {ModuleCiStep} step
 */
const renderStep = (step) => `      - name: ${JSON.stringify(step.name)}\n        run: ${JSON.stringify(step.run)}\n\n`;

/**
 * @param {{ os: string, release?: boolean, systemSteps: ModuleCiStep[] }} opts
 * @returns {string} checkout, module system steps, pnpm, Node, install
 */
const setupSteps = ({ os, release = false, systemSteps }) =>
  fillTemplate(RELEASE_DIR, 'setup-steps.yml.tmpl', {
    CHECKOUT: release ? CHECKOUT_TAG : '',
    SYSTEM: systemSteps.filter((step) => !step.os || step.os === os).map(renderStep).join(''),
  }).trimEnd();

export { setupSteps };
