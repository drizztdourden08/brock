/* @layer tooling-scripts @kind logic */
import { pushVerb } from './push.mjs';
import { openVerb } from './open.mjs';
import { statusVerb } from './status.mjs';

const SUB_VERBS = Object.freeze({ push: pushVerb, open: openVerb, status: statusVerb });

const USAGE = [
  ...Object.values(SUB_VERBS).map((verb) => verb.usage),
  '  The worktree name is optional on every pr verb: left off, it is the worktree you are standing in.',
].join('\n');

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const prVerb = {
  usage: USAGE,
  asks: true,
  run: (positional, options, ctx) => {
    const [sub, ...rest] = positional;
    const verb = SUB_VERBS[sub];
    if (!verb) throw new Error(`Unknown pr verb "${sub ?? ''}".\n\n${USAGE}`);
    return verb.run(rest, options, ctx);
  },
};

export { prVerb };
