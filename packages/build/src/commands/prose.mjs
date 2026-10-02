/* @layer tooling-scripts @kind logic */
import { runProse as runStandardsProse } from '@drizztdourden08/standards/prose';

/**
 * @param {{ rootDir: string, allow?: string[] }} ctx
 * @returns {number} exit code
 */
const runProse = (ctx) => runStandardsProse({ rootDir: ctx.rootDir, allow: ctx.allow, label: 'brock prose' });

export { runProse };
