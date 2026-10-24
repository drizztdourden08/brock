/* @layer tooling-scripts @kind logic */
import { installHint } from './install-hint.mjs';

/**
 * @param {NodeJS.Platform[]} hosts
 * @returns {import('../platform.type.mjs').DoctorCheck}
 */
const dpkgCheck = (hosts) => ({
  label: 'dpkg-deb (for the server .deb)',
  hosts,
  run: (ctx) => {
    const { ok, out } = ctx.probe('dpkg-deb', ['--version']);
    const version = /\d+\.\d+[\w.+~-]*/.exec(out)?.[0];
    return ok ? { status: 'ok', detail: version ?? 'installed' } : { status: 'missing', install: installHint('dpkg', ctx.host) };
  },
});

export { dpkgCheck };
