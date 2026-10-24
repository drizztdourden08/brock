/* @layer tooling-scripts @kind logic */
import { loadStandards } from '@drizztdourden08/standards';
import { collectFindings, resolveScope } from '@drizztdourden08/standards/structure';
import brockApp from '../../standards.extension.mjs';
import { publishedNames, withPublishedNames } from './published-names.mjs';
import { verbatimReport } from './verbatim-report.mjs';

const structureLabel = 'brock structure';

/**
 * @param {{ rootDir: string, scope?: string }} ctx
 * @returns {Promise<number>} exit code
 */
const runStructure = async (ctx) => {
  const loaded = loadStandards({ rootDir: ctx.rootDir, extensions: [brockApp] });
  const scope = resolveScope(ctx.rootDir, ctx.scope ?? loaded.options.scope);
  const { findings: standard, notes, counted } = await collectFindings(ctx.rootDir, scope, loaded.extensions);
  const findings = withPublishedNames(ctx.rootDir, standard, await publishedNames(ctx.rootDir));
  for (const note of notes) console.log(`${structureLabel}: ${note}`);
  if (findings.length) {
    console.error(`${structureLabel}: ${findings.length} finding(s) under ${scope}:`);
    for (const finding of findings) console.error(`  ${finding}`);
  } else console.log(`${structureLabel}: ${counted} package(s) under ${scope}, no findings.`);
  for (const line of verbatimReport(ctx.rootDir, structureLabel)) console.log(line);
  return findings.length ? 1 : 0;
};

export { runStructure };
