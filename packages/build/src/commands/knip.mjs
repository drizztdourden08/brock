/* @layer tooling-scripts @kind logic */
import { runKnip as runStandardsKnip } from '@drizztdourden08/standards/knip';

/**
 * @param {{ rootDir: string, args: string[] }} ctx
 * @returns {number} exit code
 */
const runKnip = (ctx) => runStandardsKnip({ rootDir: ctx.rootDir, args: ctx.args, label: 'brock knip' });

export { runKnip };
