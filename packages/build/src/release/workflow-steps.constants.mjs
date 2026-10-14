/* @layer tooling-scripts @kind constants */
const STEP_POINTS = Object.freeze({
  ci: Object.freeze(['beforeInstall', 'beforeBuild', 'afterBuild', 'beforeTest']),
  release: Object.freeze(['beforeInstall', 'beforePackage', 'afterPackage']),
});

const STEP_KEYS = new Set(['name', 'run', 'uses', 'with', 'env', 'shell', 'if', 'secrets', 'os', 'platforms']);

const RUNNER_OSES = Object.freeze(['windows', 'linux', 'macos']);

const SECRET_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;

const RESERVED_SECRET = /^GITHUB_/i;

const ENV_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;

const WORKFLOW_MODES = Object.freeze(['managed', 'own']);

const STEP_INDENT = '      ';

const APP_STEPS_LABEL = 'brock.config.ts workflows.steps';

export { STEP_POINTS, STEP_KEYS, RUNNER_OSES, SECRET_NAME, RESERVED_SECRET, ENV_NAME, WORKFLOW_MODES, STEP_INDENT, APP_STEPS_LABEL };
