/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { stop } from '../release/local/release-stop.mjs';
import { attempt, lastLine } from './replay-exec.mjs';
import { lockProblem } from './replay-guard.mjs';
import { isConsumer, localpkgCall, localpkgStatus, neededVersions } from './replay-localpkg.mjs';
import { registryOf } from './replay-sources.mjs';

const MESSAGE = 'chore: lockfile for the replayed versions';
const LOCK = 'pnpm-lock.yaml';

const registryFor = (cwd, name) => {
  try {
    return registryOf(cwd, name);
  } catch {
    return null;
  }
};

const checkNeed = (exec, cwd, need) => {
  const registry = registryFor(cwd, need.name);
  const present = registry ? Boolean(attempt(exec, 'npm', ['view', `${need.name}@${need.version}`, 'version', '--registry', registry], cwd)) : false;
  return { ...need, registry, present };
};

const viewCommand = (need) => `npm view ${need.name}@${need.version} version --registry ${need.registry ?? '(none in .npmrc)'}`;

const offCall = (cwd) => localpkgCall(['off', cwd, '--no-install']);

const commandsOf = (needs, cwd) => [
  ...needs.map(viewCommand),
  [offCall(cwd).command, ...offCall(cwd).args].join(' '),
  'pnpm install --no-frozen-lockfile',
  `verify ${LOCK} holds no file: outside the repo and no .coord/localpkg`,
  `git add -- ${LOCK}`,
  `git commit -m "${MESSAGE}" -- ${LOCK}`,
];

/**
 * @param {{ exec: Function, cwd: string, integration: string }} request
 * @returns {object | null} the lockfile step, null without localpkg work
 */
const lockfileItem = ({ exec, cwd, integration }) => {
  const status = localpkgStatus(exec, cwd);
  const found = neededVersions({ exec, cwd, status });
  if (!isConsumer(status, cwd) && found.length === 0) return null;
  const needs = found.map((need) => checkNeed(exec, cwd, need));
  const missing = needs.filter((need) => !need.present).map((need) => `${need.name}@${need.version}`);
  const blocked = missing.length > 0 ? { blocked: `${missing.join(', ')} not on the registry yet. Replay its repo first.` } : {};
  return { kind: 'lockfile', id: 'lockfile', title: 'Regenerate pnpm-lock.yaml for the replayed versions', commands: commandsOf(needs, cwd), integration, needs, ...blocked };
};

/**
 * @param {object} item the lockfile plan step
 * @param {{ exec: Function, cwd: string, log: (line: string) => void }} context
 * @returns {{ url: null, committed: boolean }} localpkg off, install, verify, commit
 */
const runLockfile = (item, { exec, cwd, log }) => {
  const branch = lastLine(attempt(exec, 'git', ['rev-parse', '--abbrev-ref', 'HEAD'], cwd));
  if (branch !== item.integration) throw stop(`The lockfile commit goes on ${item.integration}, but ${branch ?? 'no branch'} is checked out.`, 1);
  const off = offCall(cwd);
  exec(off.command, off.args, { cwd });
  exec('pnpm', ['install', '--no-frozen-lockfile'], { cwd });
  const problem = lockProblem(readFileSync(join(cwd, LOCK), 'utf8'), cwd);
  if (problem) throw stop(`${LOCK} still holds ${problem} after the install.`, 1);
  if (!attempt(exec, 'git', ['status', '--porcelain', '--', LOCK], cwd)) {
    log(`  ${LOCK} is already current. Nothing to commit.`);
    return { url: null, committed: false };
  }
  exec('git', ['add', '--', LOCK], { cwd });
  exec('git', ['commit', '-m', MESSAGE, '--', LOCK], { cwd });
  return { url: null, committed: true };
};

export { lockfileItem, runLockfile };
