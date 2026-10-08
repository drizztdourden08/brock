/* @layer tooling-scripts @kind logic */
import { launchVerb } from '../launch/launch-verb.mjs';
import { createVerb } from './create.mjs';
import { refreshVerb } from './refresh.mjs';
import { removeVerb } from './remove.mjs';
import { finishVerb } from './finish.mjs';
import { commitVerb } from './commit.mjs';
import { baseVerb } from './base.mjs';

const launchSubVerb = {
  usage: '  brock worktree launch <name> <state|none> [--prod] [--visible [--sound]] [passthrough flags]',
  run: (positional, options, ctx) => launchVerb.run(positional, options, ctx),
};

const SUB_VERBS = Object.freeze({
  create: createVerb,
  launch: launchSubVerb,
  refresh: refreshVerb,
  remove: removeVerb,
  finish: finishVerb,
  commit: commitVerb,
  base: baseVerb,
});

const USAGE = [
  ...Object.values(SUB_VERBS).map((verb) => verb.usage),
  '  The worktree name is optional on commit, finish and base: left off, it is the worktree you are standing in.',
].join('\n');

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const worktreeVerb = {
  usage: USAGE,
  run: (positional, options, ctx) => {
    const [sub, ...rest] = positional;
    const verb = SUB_VERBS[sub];
    if (!verb) throw new Error(`Unknown worktree verb "${sub ?? ''}".\n\n${USAGE}`);
    return verb.run(rest, options, ctx);
  },
};

export { worktreeVerb };
