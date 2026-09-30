/* @layer tooling-scripts @kind logic */
import { nodeCheck } from './node-check.mjs';
import { pnpmCheck } from './pnpm-check.mjs';

/**
 * @returns {import('../platform.type.mjs').DoctorCheck[]} what every app needs
 */
const baseChecks = () => [nodeCheck(), pnpmCheck()];

export { baseChecks };
