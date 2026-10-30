/* @layer tooling-scripts @kind logic */
import { stop } from '../release/local/release-stop.mjs';
import { attempt } from './replay-exec.mjs';

const REMOTE = 'origin';
const LOCK = 'pnpm-lock.yaml';
const LOCALPKG = '.coord/localpkg';
const FILE_REF = /(?<![\w-])file:([^\s,'"})]+)/g;
const ABSOLUTE = /^(?:\/|[a-z]:|~)/i;

const normal = (text) => String(text).replace(/\\/g, '/');

const bare = (value) => value.replace(/^\/+/, '').toLowerCase();

const outside = (target, root) => {
  const path = normal(target);
  if (path.startsWith('..')) return true;
  if (!ABSOLUTE.test(path)) return false;
  return !bare(path).startsWith(bare(normal(root)));
};

/**
 * @param {string} text a pnpm-lock.yaml
 * @param {string} root the repo root
 * @returns {string | null} what makes the lockfile a localpkg one, else null
 */
const lockProblem = (text, root) => {
  const body = normal(text);
  if (body.includes(LOCALPKG)) return `the text ${LOCALPKG}`;
  for (const match of body.matchAll(FILE_REF)) {
    if (outside(match[1], root)) return `file:${match[1]} outside the repo`;
  }
  return null;
};

const linesOf = (text) =>
  String(text ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const commitsOf = ({ exec, cwd, remoteBase, refs }) => {
  const shas = refs.flatMap((ref) => linesOf(attempt(exec, 'git', ['log', '--format=%H', `${REMOTE}/${remoteBase}..${ref}`], cwd)));
  return [...new Set(shas)];
};

const lockfilesOf = (exec, cwd, sha) =>
  linesOf(attempt(exec, 'git', ['diff-tree', '-r', '-m', '--root', '--no-commit-id', '--name-only', sha], cwd)).filter(
    (path) => path === LOCK || path.endsWith(`/${LOCK}`),
  );

const violationsOf = (request) => {
  const found = [];
  for (const sha of commitsOf(request)) {
    for (const path of lockfilesOf(request.exec, request.cwd, sha)) {
      const text = attempt(request.exec, 'git', ['show', `${sha}:${path}`], request.cwd);
      const problem = text ? lockProblem(text, request.cwd) : null;
      if (problem) found.push({ sha, path, problem });
    }
  }
  return found;
};

const describe = ({ sha, path, problem }) => `commit ${sha.slice(0, 9)} holds ${problem} in ${path}`;

/**
 * @param {{ exec: Function, cwd: string, remoteBase: string, refs: string[] }} request
 * @returns {object | null} a BLOCKED step for a localpkg lockfile
 */
const guardItem = (request) => {
  const [first] = violationsOf(request);
  if (!first) return null;
  return { kind: 'guard', id: 'lockfile-guard', title: 'Refuse a localpkg lockfile in the commits to push', commands: [], blocked: describe(first) };
};

/**
 * @param {{ exec: Function, cwd: string, remoteBase: string, refs: string[] }} request
 * @returns {void} throws a stop (exit 1) naming the commit and file
 */
const assertNoLocalLockfile = (request) => {
  const [first] = violationsOf(request);
  if (first) throw stop(`${describe(first)}. Nothing was pushed.`, 1);
};

export { assertNoLocalLockfile, guardItem, lockProblem };
