/* @layer tooling-scripts @kind logic */
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { heavyNodeEnv } from '../lint/heavy-env.mjs';
import { CACHE_DIR_ENV } from '../lint/lint.constants.mjs';
import { planLint } from '../lint/lint-plan.mjs';
import { resolveBin, runInherit } from '../run.mjs';

const cacheFile = (rootDir, mode, env) => {
  const dir = resolve(env[CACHE_DIR_ENV] ?? join(rootDir, 'node_modules', '.cache', 'brock'));
  mkdirSync(dir, { recursive: true });
  return join(dir, `eslint-${mode === 'all' ? 'all' : 'changed'}.json`);
};

/**
 * @param {{ rootDir: string, args?: string[], all?: boolean, changed?: boolean, noCache?: boolean, passthrough?: string[], env?: NodeJS.ProcessEnv }} ctx
 * @returns {Promise<number>} eslint's exit code
 */
const runLint = async (ctx) => {
  const env = ctx.env ?? process.env;
  const plan = planLint({ cwd: ctx.rootDir, all: ctx.all, changed: ctx.changed, paths: ctx.args ?? [], env });
  console.log(plan.line);
  if (!plan.targets.length) return 0;
  const cached = !ctx.noCache && !env.CI;
  const cacheArgs = cached ? ['--cache', '--cache-strategy', 'content', '--cache-location', cacheFile(ctx.rootDir, plan.mode, env)] : [];
  const scoped = plan.mode === 'all' ? [] : ['--no-warn-ignored'];
  const eslintArgs = [resolveBin(ctx.rootDir, 'eslint'), ...plan.targets, ...cacheArgs, ...scoped, ...(ctx.passthrough ?? [])];
  return runInherit(process.execPath, eslintArgs, { cwd: ctx.rootDir, env: heavyNodeEnv(env) });
};

export { runLint };
