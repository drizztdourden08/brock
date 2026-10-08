/* @layer tooling-scripts @kind logic */
import { LINUX_USAGE } from './linux.constants.mjs';
import { linuxDoctor } from './linux-doctor.mjs';
import { linuxInit } from './linux-init.mjs';
import { linuxPush } from './linux-push.mjs';

const subVerbs = {
  push: (options, ctx) => linuxPush(options, ctx),
  doctor: (options, ctx) => linuxDoctor(ctx),
  init: (options, ctx) => linuxInit(ctx),
};

const run = async (positional, options, ctx) => {
  const [sub] = positional;
  const handler = subVerbs[sub];
  if (!handler) throw new Error(`Unknown linux verb "${sub ?? ''}".\n\n${LINUX_USAGE}`);
  return handler(options, ctx);
};

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const linuxVerb = { usage: LINUX_USAGE, run, asks: false };

export { linuxVerb };
