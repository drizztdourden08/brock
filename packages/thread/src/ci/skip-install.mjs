/* @layer tooling-scripts @kind logic */
import { INSTALL_STEP } from './ci.constants.mjs';

const INSTALL_ONLY = /^\s*pnpm (install|i)\b[^\n]*$/;
const NOTE = 'Skipped by --here: this checkout is already installed.';

const isInstall = (step) => step.name === INSTALL_STEP.name || INSTALL_ONLY.test(step.command ?? '');

/**
 * @param {object[]} plan the planned steps
 * @returns {object[]} the plan with its install steps marked skipped
 */
const skipInstall = (plan) => plan.map((step) => (isInstall(step) ? { ...step, skip: NOTE, required: false } : step));

export { skipInstall };
