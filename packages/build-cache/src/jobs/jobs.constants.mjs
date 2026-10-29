/* @layer tooling-scripts @kind constants */
const JOB_STATE = Object.freeze({ RUNNING: 'running', DONE: 'done', FAILED: 'failed' });
const HEARTBEAT_MS = 5000;
const STALE_MS = 30_000;
const POLL_MS = 1000;

export { HEARTBEAT_MS, JOB_STATE, POLL_MS, STALE_MS };
