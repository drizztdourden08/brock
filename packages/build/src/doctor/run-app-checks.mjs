/* @layer tooling-scripts @kind logic */
import { driftCheck } from './drift-check.mjs';
import { linksCheck } from './links-check.mjs';
import { undeclaredCheck } from './undeclared-check.mjs';
import { versionsCheck } from './versions-check.mjs';

const CHECKS = [versionsCheck, linksCheck, driftCheck, undeclaredCheck];
const WIDTH = Math.max(...CHECKS.map((check) => check.label.length));

/** @param {{ label: string, run: (ctx: any) => any }} check @param {object} ctx */
const settle = async (check, ctx) => {
  try {
    return await check.run(ctx);
  } catch (error) {
    return { problems: [`the check could not run: ${error instanceof Error ? error.message : String(error)}`], detail: '' };
  }
};

/**
 * @param {{ rootDir: string, config: import('../config.mjs').BrockConfig | null }} ctx the app folder and its config, null when none
 * @returns {Promise<{ ok: boolean, lines: string[] }>} one line per check, or per problem
 */
const runAppChecks = async (ctx) => {
  const lines = [];
  let ok = true;
  for (const check of CHECKS) {
    const { problems, detail } = await settle(check, ctx);
    const label = check.label.padEnd(WIDTH);
    if (problems.length === 0) lines.push(`  ok       ${label}  ${detail}`);
    for (const problem of problems) lines.push(`  problem  ${label}  ${problem}`);
    ok = ok && problems.length === 0;
  }
  return { ok, lines };
};

export { runAppChecks };
