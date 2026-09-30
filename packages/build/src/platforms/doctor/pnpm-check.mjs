/* @layer tooling-scripts @kind logic */
import { installHint } from './install-hint.mjs';

/**
 * @returns {import('../platform.type.mjs').DoctorCheck}
 */
const pnpmCheck = () => ({
  label: 'pnpm',
  run: (ctx) => {
    const { ok, out } = ctx.probe('pnpm', ['--version']);
    return ok ? { status: 'ok', detail: out } : { status: 'missing', install: installHint('pnpm', ctx.host) };
  },
});

export { pnpmCheck };
