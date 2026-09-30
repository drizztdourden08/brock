/* @layer tooling-scripts @kind logic */
import { baseChecks } from './base-checks.mjs';
import { HOST_NAMES } from './doctor-hosts.constants.mjs';

/**
 * @typedef {import('../platform.type.mjs').DoctorCheck} DoctorCheck
 * @typedef {import('../platform.type.mjs').DoctorContext} DoctorContext
 * @typedef {import('../platform.type.mjs').DoctorResult & { label: string }} LabelledResult
 */

const expand = (entries, ctx) => entries.flatMap((entry) => (typeof entry === 'function' ? entry(ctx) : [entry]));

/**
 * @param {DoctorCheck} check
 * @param {DoctorContext} ctx
 * @returns {LabelledResult}
 */
const runCheck = (check, ctx) => {
  if (check.hosts && !check.hosts.includes(ctx.host)) {
    return { label: check.label, status: 'skip', detail: `checked on ${check.hosts.map((host) => HOST_NAMES[host] ?? host).join(' or ')}` };
  }
  return { label: check.label, ...check.run(ctx) };
};

/**
 * @param {import('../platform.type.mjs').Platform[]} platforms
 * @param {DoctorContext} ctx
 * @returns {{ title: string, results: LabelledResult[] }[]}
 */
const runDoctor = (platforms, ctx) => [
  { title: 'Every app', results: baseChecks().map((check) => runCheck(check, ctx)) },
  ...platforms.map((platform) => ({ title: platform.label, results: expand(platform.doctor, ctx).map((check) => runCheck(check, ctx)) })),
];

export { runDoctor };
