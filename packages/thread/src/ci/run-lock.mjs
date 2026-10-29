/* @layer tooling-scripts @kind logic */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ciDir } from './ci-paths.mjs';
import { LOCK_FILE, LOCK_POLL_MS } from './ci.constants.mjs';

const alive = (pid) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === 'EPERM';
  }
};

const holderOf = (file) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
};

const tryTake = (file, runId) => {
  try {
    writeFileSync(file, JSON.stringify({ pid: process.pid, runId, at: new Date().toISOString() }), { flag: 'wx' });
    return true;
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    const holder = holderOf(file);
    if (holder && !alive(holder.pid)) rmSync(file, { force: true });
    return false;
  }
};

const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

/**
 * @param {{ project: string, runId: string, timeoutMs: number, onWait?: (holder: object | null) => void, cancelled?: () => boolean, pollMs?: number }} request
 * @returns {Promise<() => void>} the release function
 */
const acquireRunLock = async ({ project, runId, timeoutMs, onWait = () => {}, cancelled = () => false, pollMs = LOCK_POLL_MS }) => {
  const file = join(ciDir(project), LOCK_FILE);
  mkdirSync(ciDir(project), { recursive: true });
  const deadline = Date.now() + timeoutMs;
  let told = false;
  while (!tryTake(file, runId)) {
    if (cancelled()) throw new Error('Cancelled while queued.');
    if (Date.now() >= deadline) throw new Error(`Another check run still holds ${file} after ${Math.round(timeoutMs / 60000)} minute(s).`);
    if (!told) onWait(holderOf(file));
    told = true;
    await sleep(pollMs);
  }
  return () => rmSync(file, { force: true });
};

export { acquireRunLock };
