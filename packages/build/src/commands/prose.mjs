/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { findSlop } from '@drizztdourden08/brock-lint-config/slop-patterns';
import { readProseIgnore } from './prose-ignore.mjs';

const TEXT_FILES = /\.(json|jsonc|json5|ya?ml|toml|ini|html|htm|svg|txt|env|properties|cjs|mjs|js|ts|tsx|css|md)$/i;
const OWN_LINTER = /\.(tsx?|mjs|cjs|jsx?|css|md)$/i;
const CONFIG_FILE = /(^|[\\/])(?:[^\\/]+\.config\.(?:js|ts|cjs|mjs)|\.markdownlint-cli2\.mjs)$/;
const SKIP = /(^|[\\/])(?:pnpm-lock\.yaml|package-lock\.json|.*\.min\.[a-z]+|\.brock[\\/]|\.user-data[\\/]|CHANGELOG\.md)$/i;
const SKIP_DIRS = new Set(['node_modules', 'dist', 'out', 'release', 'coverage', '.git', '.brock', '.user-data', '.claude', '.ai']);

const gitFiles = (rootDir) => {
  try {
    const out = execFileSync('git', ['ls-files', '-co', '--exclude-standard', '-z'], { cwd: rootDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });
    return out.split('\0').filter(Boolean);
  } catch {
    return null;
  }
};

const walkFiles = (rootDir, dir = rootDir, out = []) => {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const file = join(dir, name);
    if (statSync(file).isDirectory()) walkFiles(rootDir, file, out);
    else out.push(relative(rootDir, file).replace(/\\/g, '/'));
  }
  return out;
};

const candidateFiles = (rootDir) => gitFiles(rootDir) ?? walkFiles(rootDir);

const isProseTarget = (file) => {
  if (!TEXT_FILES.test(file) || SKIP.test(file)) return false;
  if (OWN_LINTER.test(file) && !CONFIG_FILE.test(file)) return false;
  return true;
};

const lineColOf = (text, index) => {
  const before = text.slice(0, index);
  return { line: before.split('\n').length, col: index - before.lastIndexOf('\n') };
};

const scanFile = (rootDir, file, allow) => {
  const text = readFileSync(join(rootDir, file), 'utf8');
  return findSlop(text, allow ? { allow } : {}).map((hit) => {
    const { line, col } = lineColOf(text, hit.index);
    return `${file}:${line}:${col}  ${hit.message}`;
  });
};

/**
 * @param {{ rootDir: string, allow?: string[] }} ctx
 * @returns {number} exit code
 */
const runProse = ({ rootDir, allow }) => {
  const ignoreFile = join(rootDir, '.proseignore');
  const ignore = existsSync(ignoreFile) ? readProseIgnore(readFileSync(ignoreFile, 'utf8')) : { matchers: [], problems: [] };
  for (const problem of ignore.problems) console.log(`.proseignore: ${problem}`);
  const files = candidateFiles(rootDir).filter(isProseTarget).filter((file) => !ignore.matchers.some((match) => match(file)));
  const findings = files.flatMap((file) => scanFile(rootDir, file, allow));
  for (const finding of findings) console.log(finding);
  console.log(`brock prose: ${files.length} file(s) outside eslint, stylelint and markdownlint scanned, ${findings.length} finding(s).`);
  return findings.length === 0 && ignore.problems.length === 0 ? 0 : 1;
};

export { runProse };
