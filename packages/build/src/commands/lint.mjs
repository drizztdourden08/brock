/* @layer tooling-scripts @kind logic */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { heavyNodeEnv } from '../lint/heavy-env.mjs';
import { runBatches } from '../lint/lint-batches.mjs';
import { lintCacheFile } from '../lint/lint-cache.mjs';
import { DEFAULT_MEMORY_MB, FULL_TREE_MEMORY_MB } from '../lint/lint.constants.mjs';
import { planLint } from '../lint/lint-plan.mjs';
import { resolveBin, runInherit } from '../run.mjs';

const batchRunner = fileURLToPath(new URL('../lint/batch-runner.mjs', import.meta.url));

const cacheArgsFor = (ctx, env, name) => {
  if (ctx.noCache || env.CI) return [];
  const location = lintCacheFile(ctx.rootDir, name, env);
  return location ? ['--cache', '--cache-strategy', 'content', '--cache-location', location] : [];
};

const runWholeTree = (ctx, env, plan) => {
  const eslintArgs = [resolveBin(ctx.rootDir, 'eslint'), ...plan.targets, ...cacheArgsFor(ctx, env, 'all'), ...(ctx.passthrough ?? [])];
  return runInherit(process.execPath, eslintArgs, { cwd: ctx.rootDir, env: heavyNodeEnv(env, FULL_TREE_MEMORY_MB) });
};

const runInBatches = async (ctx, env, plan) => {
  const eslint = resolveBin(ctx.rootDir, 'eslint');
  const listDir = mkdtempSync(join(tmpdir(), 'brock-lint-'));
  try {
    const { code, codes } = await runBatches(plan.batches, (batch, index) => {
      const listFile = join(listDir, `batch-${index}.json`);
      writeFileSync(listFile, JSON.stringify(batch));
      console.log(`brock lint: batch ${index + 1} of ${plan.batches.length}, ${batch.length} files`);
      const args = [batchRunner, eslint, listFile, ...cacheArgsFor(ctx, env, `all-${index}`), '--no-warn-ignored', '--no-error-on-unmatched-pattern',...(ctx.passthrough ?? [])];
      return runInherit(process.execPath, args, { cwd: ctx.rootDir, env: heavyNodeEnv(env, FULL_TREE_MEMORY_MB) });
    });
    const failed = codes.filter(Boolean).length;
    console.log(`brock lint: ${plan.batches.length} batches done, ${failed ? `${failed} with problems, exit ${code}` : 'all clean'}`);
    return code;
  } finally {
    rmSync(listDir, { recursive: true, force: true });
  }
};

/**
 * @param {{ rootDir: string, args?: string[], all?: boolean, changed?: boolean, noCache?: boolean, passthrough?: string[], env?: NodeJS.ProcessEnv }} ctx
 * @returns {Promise<number>} the worst eslint exit code
 */
const runLint = async (ctx) => {
  const env = ctx.env ?? process.env;
  const plan = planLint({ cwd: ctx.rootDir, all: ctx.all, changed: ctx.changed, paths: ctx.args ?? [], env });
  console.log(plan.line);
  if (!plan.targets.length) return 0;
  if (plan.mode === 'all') return plan.batches ? runInBatches(ctx, env, plan) : runWholeTree(ctx, env, plan);
  const eslintArgs = [resolveBin(ctx.rootDir, 'eslint'), ...plan.targets, ...cacheArgsFor(ctx, env, 'changed'), '--no-warn-ignored', '--no-error-on-unmatched-pattern',...(ctx.passthrough ?? [])];
  return runInherit(process.execPath, eslintArgs, { cwd: ctx.rootDir, env: heavyNodeEnv(env, DEFAULT_MEMORY_MB) });
};

export { runLint };
