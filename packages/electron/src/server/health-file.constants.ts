/* @layer electron-main @kind constants */
const HEALTH_DIR = '.brock';
const HEALTH_FILE = 'server-health.json';
const HEARTBEAT_MS = 10_000;
const HEALTH_MAX_AGE_MS = 30_000;

export { HEALTH_DIR, HEALTH_FILE, HEARTBEAT_MS, HEALTH_MAX_AGE_MS };
