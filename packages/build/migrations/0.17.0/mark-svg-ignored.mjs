/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { gitignoreChain, insertLines } from '../../src/upgrade/gitignore-chain.mjs';

const MARK = 'public/logos/mark.svg';
const LOGO = /^(\*\*\/)?public\/logos\/icon(-bot)?(-256)?\.(png|svg|ico)$/;
const MARK_LINE = /^(\*\*\/)?public\/logos\/mark\.svg$/;

const tracked = (rootDir) => {
  try {
    return execFileSync('git', ['ls-files', '--', MARK], { cwd: rootDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() !== '';
  } catch {
    return false;
  }
};

const ignoreMark = (chain) => {
  if (chain.some((ignore) => ignore.lines.some((line) => MARK_LINE.test(line.trim())))) return [];
  const owner = chain.find((ignore) => ignore.lines.some((line) => LOGO.test(line.trim())));
  if (!owner) return [];
  const last = owner.lines.findLastIndex((line) => LOGO.test(line.trim()));
  const prefix = owner.lines[last].trim().startsWith('**/') ? '**/' : '';
  insertLines(owner, last, [`${prefix}${MARK}`]);
  return [owner.label];
};

const workspace = ({ rootDir }) => {
  const touched = ignoreMark(gitignoreChain(rootDir));
  const todos = tracked(rootDir)
    ? [{ file: MARK, line: null, message: `brock icons writes ${MARK} from icons.brand, so git ignores it now, but this repo still tracks it. Run git rm --cached ${MARK}; if it is the app's own art and not the brand mark, keep it and drop the ignore line instead.` }]
    : [];
  return { touched, todos };
};

const migration = Object.freeze({
  id: 'mark-svg-ignored',
  summary: 'brock icons writes public/logos/mark.svg beside the other logos; git ignores it next to them, and a tracked copy becomes a to-do.',
  workspace,
});

export { migration };
