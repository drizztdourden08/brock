/* @layer tooling-scripts @kind logic */
import { runStructure as runStandardsStructure } from '@drizztdourden08/standards/structure';
import brockApp from '../../standards.extension.mjs';
import { verbatimReport } from './verbatim-report.mjs';

const structureLabel = 'brock structure';

/**
 * @param {{ rootDir: string, scope?: string }} ctx
 * @returns {Promise<number>} exit code
 */
const runStructure = async (ctx) => {
  const code = await runStandardsStructure({ rootDir: ctx.rootDir, scope: ctx.scope, label: structureLabel, extensions: [brockApp] });
  for (const line of verbatimReport(ctx.rootDir, structureLabel)) console.log(line);
  return code;
};

export { runStructure };
