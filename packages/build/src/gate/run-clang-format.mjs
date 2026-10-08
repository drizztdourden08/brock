/* @layer tooling-scripts @kind logic */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { cSources } from './c-sources.mjs';
import { repoRootOf } from './clang-format-files.mjs';
import { findClangFormat } from './find-clang-format.mjs';
import { CLANG_FORMAT_BATCH, CLANG_FORMAT_FILE, CLANG_FORMAT_HINT } from './gate.constants.mjs';

const UNFORMATTED = /^(.+?):\d+:\d+: (?:error|warning): code should be clang-formatted/;

const quote = (arg) => (/^[\w./:\\=+-]+$/.test(arg) ? arg : `"${arg.replace(/"/g, '\\"')}"`);

const run = (bin, args) => {
  const options = { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 };
  const result = /\.(?:cmd|bat)$/i.test(bin)
    ? spawnSync([bin, ...args].map(quote).join(' '), { ...options, shell: true })
    : spawnSync(bin, args, options);
  if (result.error) throw new Error(`could not run ${bin}: ${result.error.message}`);
  return { status: result.status ?? 1, out: `${result.stdout ?? ''}${result.stderr ?? ''}` };
};

const batches = (files) => Array.from({ length: Math.ceil(files.length / CLANG_FORMAT_BATCH) }, (_, i) => files.slice(i * CLANG_FORMAT_BATCH, (i + 1) * CLANG_FORMAT_BATCH));

const lineCounts = (outputs) => {
  const counts = new Map();
  for (const line of outputs.join('\n').split(/\r?\n/)) {
    const file = UNFORMATTED.exec(line)?.[1];
    if (file) counts.set(file, (counts.get(file) ?? 0) + 1);
  }
  return counts;
};

const toolFor = (appDir, repoRoot, find) => {
  const style = join(repoRoot, CLANG_FORMAT_FILE);
  if (!existsSync(style)) throw new Error(`${CLANG_FORMAT_FILE} is missing at ${repoRoot}; run brock sync, which writes it while gate.clangFormat names sources`);
  const bin = find([appDir, repoRoot]);
  if (!bin) throw new Error(`no clang-format found. ${CLANG_FORMAT_HINT}`);
  return { bin, style };
};

const summary = (check, total, differing) => {
  if (!check) return `clang-format: formatted ${total} C file(s)`;
  const rest = differing ? '; brock clang-format rewrites the others' : '';
  return `clang-format: ${total - differing} of ${total} C file(s) match ${CLANG_FORMAT_FILE}${rest}`;
};

const report = (repoRoot, results, log) => {
  const counts = lineCounts(results.map((result) => result.out));
  for (const [file, count] of counts) log(`  ${relative(repoRoot, file).replace(/\\/g, '/')}: ${count} place(s) differ from ${CLANG_FORMAT_FILE}`);
  const failures = results.filter((result) => result.status !== 0);
  if (!counts.size) for (const result of failures) log(result.out.trim());
  return { differing: counts.size, failed: failures.length > 0 };
};

/**
 * @param {{ appDir: string, entries: string[], check: boolean, log?: (line: string) => void, find?: typeof findClangFormat }} opts
 * @returns {number} exit code, 1 when a file differs or a run failed
 */
const runClangFormat = ({ appDir, entries, check, log = console.log, find = findClangFormat }) => {
  const repoRoot = repoRootOf(appDir);
  const { bin, style } = toolFor(appDir, repoRoot, find);
  const files = cSources(repoRoot, entries);
  const args = check ? ['--dry-run', '--Werror', `--style=file:${style}`] : ['-i', `--style=file:${style}`];
  const { differing, failed } = report(repoRoot, batches(files).map((batch) => run(bin, [...args, ...batch])), log);
  log(summary(check, files.length, differing));
  return failed ? 1 : 0;
};

export { runClangFormat };
