/* @layer tooling-scripts @kind logic */
import { installHint } from './install-hint.mjs';

/**
 * @returns {import('../platform.type.mjs').DoctorCheck}
 */
const xcodeCheck = () => ({
  label: 'Xcode command line tools',
  hosts: ['darwin'],
  run: (ctx) => {
    const { ok, out } = ctx.probe('xcode-select', ['-p']);
    return ok ? { status: 'ok', detail: out } : { status: 'missing', install: installHint('xcode', ctx.host) };
  },
});

export { xcodeCheck };
