/* @layer tooling-scripts @kind logic */
import { checkoutOf } from '../checkout-of.mjs';
import { snesOptions } from '../snes-options.mjs';
import { runVaultSync } from './vault-sync.mjs';

const USAGE = [
  '  brock snes vault sync                    apply every unambiguous change, both ways',
  '  brock snes vault status                  report and write nothing',
  '  brock snes vault force-push "<msg>"      this checkout wins everywhere (asks)',
].join('\n');

const PUSH_REFUSAL = 'snes vault push: there is no pull-request vault push. The only outbound direction is "snes vault force-push <msg>", a one-sided overwrite where this checkout wins. Use it only when that is what you want.';

const MODES = {
  sync: { mode: 'sync', asks: false },
  status: { mode: 'status', asks: false },
  'force-push': { mode: 'force-push', asks: true },
};

const run = async (positional, options, ctx) => {
  const [sub, message] = positional;
  if (sub === 'push') throw new Error(PUSH_REFUSAL);
  const entry = MODES[sub];
  if (!entry) throw new Error(`Unknown vault verb "${sub ?? ''}".\n${USAGE}`);
  return runVaultSync({
    mode: entry.mode,
    root: checkoutOf(ctx),
    main: ctx.rootDir,
    name: ctx.workspace.name,
    vault: snesOptions('vault', ctx.workspace),
    message,
    log: ctx.log,
  });
};

const vaultVerb = { usage: USAGE, run };

export { vaultVerb };
