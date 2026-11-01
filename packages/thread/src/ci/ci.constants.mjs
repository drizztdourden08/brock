/* @layer tooling-scripts @kind constants */
const EXIT = Object.freeze({ pass: 0, failed: 1, setup: 2 });
const TRIGGERS = Object.freeze(['push', 'pr', 'manual', 'release']);
const INSTALL_STEP = Object.freeze({ name: 'install', command: 'pnpm install --offline --frozen-lockfile' });
const LOCALPKG_INSTALL_COMMAND = 'pnpm install --offline --no-frozen-lockfile';
const GATE_FALLBACK = Object.freeze({ name: 'brock gate', command: 'pnpm exec brock gate' });
const WORKFLOWS_DIR = '.github/workflows';
const WORKFLOW_FILE = `${WORKFLOWS_DIR}/ci.yml`;
const STANDARDS_CI = /standards\/\.github\/workflows\/ci\.ya?ml/;
const LOCK_FILE = '.lock';
const LOCK_POLL_MS = 2000;
const DEFAULT_WAIT_MINUTES = 240;
const TIMEOUT_CODE = 124;
const KILL_GRACE_MS = 5000;
const LOCK_BUDGET_MS = 2 * 60 * 60000;
const LOCK_SLACK_MS = 2 * 60000;
const OFFLINE_NOTE = 'The offline install could not resolve everything from the local pnpm store. The runner does not reach the network; fetch the missing package into the store or wait for the local registry.';

export { DEFAULT_WAIT_MINUTES, EXIT, GATE_FALLBACK, INSTALL_STEP, KILL_GRACE_MS, LOCALPKG_INSTALL_COMMAND, LOCK_BUDGET_MS, LOCK_FILE, LOCK_POLL_MS, LOCK_SLACK_MS, OFFLINE_NOTE, TIMEOUT_CODE, STANDARDS_CI, TRIGGERS, WORKFLOW_FILE, WORKFLOWS_DIR };
