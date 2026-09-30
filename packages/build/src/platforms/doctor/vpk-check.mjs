/* @layer tooling-scripts @kind logic */
import { vpkCommand } from '../../packaging/vpk-command.mjs';
import { installHint } from './install-hint.mjs';

/**
 * @param {NodeJS.Platform[]} hosts
 * @returns {import('../platform.type.mjs').DoctorCheck}
 */
const vpkCheck = (hosts) => ({
  label: 'vpk (Velopack)',
  hosts,
  run: (ctx) => {
    const { ok, out } = ctx.probe(vpkCommand(), ['--help']);
    const version = /\d+\.\d+\.\d+[\w.-]*/.exec(out)?.[0];
    return ok ? { status: 'ok', detail: version ?? 'installed' } : { status: 'missing', install: installHint('vpk', ctx.host) };
  },
});

export { vpkCheck };
