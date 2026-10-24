/* @layer tooling-scripts @kind constants */
const STEP_POINTS = Object.freeze({
  ci: Object.freeze(['beforeInstall', 'beforeBuild', 'afterBuild', 'beforeTest']),
  release: Object.freeze(['beforeInstall', 'prepare', 'beforePackage', 'afterPackage']),
});

const WORKFLOW_JOBS = Object.freeze({
  ci: Object.freeze(['changes', 'quality', 'review', 'web', 'server', 'workspace']),
  release: Object.freeze(['prepare', 'build-windows', 'build-macos', 'build-linux', 'build-android', 'build-web', 'build-server']),
});

const STEP_KEYS = new Set(['name', 'id', 'run', 'uses', 'with', 'env', 'shell', 'if', 'secrets', 'os', 'platforms', 'jobs', 'permissions']);

const STEP_ID = /^[A-Za-z_][A-Za-z0-9_-]*$/;

const PERMISSION_LEVELS = Object.freeze({ none: 0, read: 1, write: 2 });

const PERMISSION_NAMES = Object.freeze([
  'actions', 'attestations', 'checks', 'contents', 'deployments', 'discussions', 'id-token', 'issues', 'models', 'packages', 'pages',
  'pull-requests', 'security-events', 'statuses',
]);

const RELEASE_BASE_PERMISSIONS = Object.freeze({ contents: 'write', packages: 'read' });

const ATTEST_ACTION = 'actions/attest-build-provenance@4d101475d8b20a2381f78447822ac1eab6504dd8';

const ATTEST_STAGES = Object.freeze(['beforePackage', 'afterPackage']);

const ATTEST_PERMISSIONS = Object.freeze({ 'id-token': 'write', attestations: 'write' });

const ATTEST_STEP_ID = 'brock-attest';

const ATTEST_BUNDLE_SUFFIX = '.sigstore.json';

const ATTEST_JOB = 'build-linux';

const RUNNER_OSES = Object.freeze(['windows', 'linux', 'macos']);

const SECRET_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;

const RESERVED_SECRET = /^GITHUB_/i;

const ENV_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;

const WORKFLOW_MODES = Object.freeze(['managed', 'own']);

const STEP_INDENT = '      ';

const APP_STEPS_LABEL = 'brock.config.ts workflows.steps';

const APP_ATTEST_LABEL = 'brock.config.ts workflows.attest';

export {
  STEP_ID, PERMISSION_LEVELS, PERMISSION_NAMES, RELEASE_BASE_PERMISSIONS, ATTEST_ACTION, ATTEST_STAGES, ATTEST_PERMISSIONS, ATTEST_STEP_ID, ATTEST_BUNDLE_SUFFIX, ATTEST_JOB,
  STEP_POINTS, WORKFLOW_JOBS, STEP_KEYS, RUNNER_OSES, SECRET_NAME, RESERVED_SECRET, ENV_NAME, WORKFLOW_MODES, STEP_INDENT, APP_STEPS_LABEL, APP_ATTEST_LABEL,
};
