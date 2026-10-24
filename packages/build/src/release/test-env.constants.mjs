/* @layer tooling-scripts @kind constants */
const TEST_ENV_LABEL = 'brock.config.ts workflows.testEnv';

const TEST_ENV_KEYS = Object.freeze(['linuxPackages', 'userNamespaces']);

const USERNS_COMMAND = 'sudo sysctl -w kernel.apparmor_restrict_unprivileged_userns=0';

const TEST_USERNS_STEP_NAME = 'Let the tests create user namespaces';

const INSTALL_STEP_NAME = 'Install Linux packages';

export { INSTALL_STEP_NAME, TEST_ENV_KEYS, TEST_ENV_LABEL, TEST_USERNS_STEP_NAME, USERNS_COMMAND };
