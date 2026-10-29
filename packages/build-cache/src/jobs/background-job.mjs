/* @layer tooling-scripts @kind logic */
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { clearInterval, setInterval } from 'node:timers';
import { setTimeout as delay } from 'node:timers/promises';
import { HEARTBEAT_MS, JOB_STATE, POLL_MS, STALE_MS } from './jobs.constants.mjs';

/**
 * @typedef {{ state: string, pid: number, startedAt: number, heartbeatAt: number, endedAt?: number, reason?: string }} JobRecord
 */

/**
 * @param {string} file
 * @returns {JobRecord | null}
 */
const readJob = (file) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
};

const writeJob = (file, record) => {
  mkdirSync(dirname(file), { recursive: true });
  const partial = `${file}.${process.pid}.tmp`;
  writeFileSync(partial, JSON.stringify(record));
  renameSync(partial, file);
};

/**
 * @param {string} file the job record
 * @param {{ pid: number, now?: () => number }} input the process doing the job
 * @returns {void} records a job that is about to start
 */
const announceJob = (file, { pid, now = Date.now }) => {
  const at = now();
  writeJob(file, { state: JOB_STATE.RUNNING, pid, startedAt: at, heartbeatAt: at });
};

/**
 * @param {string} file the job record
 * @returns {(outcome: { failed?: string }) => void} ends the job; an early exit marks it failed
 */
const beginJob = (file) => {
  const startedAt = readJob(file)?.startedAt ?? Date.now();
  const beat = () => writeJob(file, { state: JOB_STATE.RUNNING, pid: process.pid, startedAt, heartbeatAt: Date.now() });
  beat();
  const timer = setInterval(beat, HEARTBEAT_MS);
  timer.unref();
  let ended = false;
  const end = ({ failed } = {}) => {
    if (ended) return;
    ended = true;
    clearInterval(timer);
    const state = failed ? JOB_STATE.FAILED : JOB_STATE.DONE;
    writeJob(file, { state, pid: process.pid, startedAt, heartbeatAt: Date.now(), endedAt: Date.now(), ...(failed ? { reason: failed } : {}) });
  };
  process.once('exit', () => end({ failed: 'the process exited before the job finished' }));
  return end;
};

/**
 * @param {string} file the job record
 * @param {() => number} [now]
 * @returns {{ running: boolean, record: JobRecord | null }} running while its heartbeat is fresh
 */
const jobState = (file, now = Date.now) => {
  const record = readJob(file);
  const running = record?.state === JOB_STATE.RUNNING && now() - record.heartbeatAt < STALE_MS;
  return { running, record };
};

const outcomeLine = (label, record, now) => {
  if (record?.state === JOB_STATE.DONE) return `${label} finished.`;
  if (record?.state === JOB_STATE.FAILED) return `${label} failed (${record.reason ?? 'no reason given'}); going ahead without it.`;
  const quiet = record ? Math.round((now() - record.heartbeatAt) / 1000) : 0;
  return `${label} stopped without finishing (pid ${record?.pid ?? '?'}, no heartbeat for ${quiet} s); going ahead without it.`;
};

/**
 * @param {string} file the job record
 * @param {string} label what the job is, for the log
 * @param {(line: string) => void} log
 * @param {{ now?: () => number, pollMs?: number }} [options]
 * @returns {Promise<boolean>} whether it had to wait
 */
const waitForJob = async (file, label, log, { now = Date.now, pollMs = POLL_MS } = {}) => {
  const first = jobState(file, now);
  if (!first.running) return false;
  log(`${label} is running (pid ${first.record.pid}, started ${Math.round((now() - first.record.startedAt) / 1000)} s ago); waiting for it.`);
  let state = first;
  while (state.running) {
    await delay(pollMs);
    state = jobState(file, now);
  }
  log(outcomeLine(label, state.record, now));
  return true;
};

export { announceJob, beginJob, jobState, readJob, waitForJob };
