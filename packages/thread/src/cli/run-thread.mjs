/* @layer tooling-scripts @kind logic */
import { createThreadContext } from './thread-context.mjs';
import { parseThreadArgs } from './thread-args.mjs';
import { CORE_VERBS } from './core-verbs.mjs';
import { usageFor } from './usage-for.mjs';
import { fail } from '../log.mjs';

const usageOf = (verbs, workspace) => usageFor(Object.values(verbs).map((verb) => verb.usage).join('\n'), workspace);

/**
 * @param {string[]} argv the words after the program name
 * @returns {Promise<number>}
 */
const runThread = async (argv) => {
  const [verbName, ...rest] = argv;
  let ctx;
  try {
    ctx = await createThreadContext();
  } catch (error) {
    return fail('brock', error.message);
  }
  const verbs = { ...CORE_VERBS, ...ctx.verbs };
  const verb = verbs[verbName];
  if (!verb) {
    console.error(`Unknown verb "${verbName ?? ''}".\n\n${usageOf(verbs, ctx.workspace)}`);
    return 1;
  }
  const { positional, options } = parseThreadArgs(rest);
  try {
    return (await verb.run(positional, options, ctx)) ?? 0;
  } catch (error) {
    return fail(ctx.workspace.name, usageFor(error.message, ctx.workspace));
  }
};

const threadVerbNames = () => Object.keys(CORE_VERBS);

export { runThread, threadVerbNames };
