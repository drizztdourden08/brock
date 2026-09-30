/* @layer tooling-scripts @kind logic */
import { resolveModules } from '../modules/resolve.mjs';
import { doctorReport } from './doctor/doctor-report.mjs';
import { probe } from './doctor/probe.mjs';
import { runDoctor } from './doctor/run-doctor.mjs';
import { resolvePlatforms } from './resolve-platforms.mjs';

/**
 * @param {{ rootDir: string, targets: string[], modules?: string[] }} opts
 * @returns {{ ok: boolean, lines: string[], platforms: string[], unsupported: string[] }} prints nothing, installs nothing
 */
const checkMachine = ({ rootDir, targets, modules = [] }) => {
  const { platforms, unsupported } = resolvePlatforms(targets);
  const ctx = { host: process.platform, env: process.env, probe, modules: resolveModules(rootDir, modules).modules };
  const report = doctorReport(runDoctor(platforms, ctx));
  const notYet = unsupported.map((id) => `  ${id}: not supported yet, so nothing is checked for it`);
  return { ok: report.ok, lines: [...report.lines.slice(0, -2), ...notYet, ...report.lines.slice(-2)], platforms: platforms.map((p) => p.id), unsupported };
};

export { checkMachine };
