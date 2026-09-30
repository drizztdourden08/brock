/* @layer tooling-scripts @kind logic */
import { mobileBuild } from './mobile-build.mjs';
import { mobileKeystore } from './mobile-keystore.mjs';
import { mobilePush } from './mobile-push.mjs';
import { MOBILE_USAGE } from './mobile.constants.mjs';

const subVerbs = {
  push: (options, ctx) => mobilePush(ctx),
  build: (options, ctx) => mobileBuild(options, ctx),
  keystore: (options, ctx) => mobileKeystore(ctx),
};

const run = async (positional, options, ctx) => {
  const [sub] = positional;
  const handler = subVerbs[sub];
  if (!handler) throw new Error(`Unknown mobile verb "${sub ?? ''}".\n\n${MOBILE_USAGE}`);
  await handler(options, ctx);
};

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const mobileVerb = { usage: MOBILE_USAGE, run, asks: false };

export { mobileVerb };
