/* @layer tooling-scripts @kind logic */
import { runProse as runStandardsProse } from '@drizztdourden08/standards/prose';
import { withGeneratedFilesExcluded } from './prose-excludes.mjs';

/**
 * @param {{ rootDir: string, allow?: string[] }} ctx
 * @returns {number} exit code
 */
const runProse = (ctx) => withGeneratedFilesExcluded(ctx.rootDir, () => runStandardsProse({ rootDir: ctx.rootDir, allow: ctx.allow, label: 'brock prose' }));

export { runProse };
