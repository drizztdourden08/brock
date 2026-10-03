/* @layer tooling-scripts @kind logic */
import { runStructure as runStandardsStructure } from '@drizztdourden08/standards/structure';
import brockApp from '../../standards.extension.mjs';

/**
 * @param {{ rootDir: string, scope?: string }} ctx
 * @returns {Promise<number>} exit code
 */
const runStructure = (ctx) => runStandardsStructure({ rootDir: ctx.rootDir, scope: ctx.scope, label: 'brock structure', extensions: [brockApp] });

export { runStructure };
