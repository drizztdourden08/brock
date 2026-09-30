/* @layer tooling-scripts @kind logic */
import { HOST_OF_OS } from './doctor-hosts.constants.mjs';

/**
 * @param {{ name: string, probe: string[], install: string }} entry
 * @param {string} moduleId
 * @param {NodeJS.Platform} host
 * @returns {import('../platform.type.mjs').DoctorCheck}
 */
const toCheck = (entry, moduleId, host) => ({
  label: `${entry.name} (${moduleId} module)`,
  hosts: [host],
  run: (ctx) => {
    const [command, ...args] = entry.probe;
    return ctx.probe(command, args).ok ? { status: 'ok', detail: entry.probe.join(' ') } : { status: 'missing', install: entry.install };
  },
});

/**
 * @param {'windows' | 'macos' | 'linux'} os
 * @returns {(ctx: import('../platform.type.mjs').DoctorContext) => import('../platform.type.mjs').DoctorCheck[]}
 */
const moduleChecks = (os) => (ctx) =>
  ctx.modules.flatMap((m) => (m.manifest.doctor ?? [])
    .filter((entry) => entry.os === os)
    .map((entry) => toCheck(entry, m.manifest.id, HOST_OF_OS[os])));

export { moduleChecks };
