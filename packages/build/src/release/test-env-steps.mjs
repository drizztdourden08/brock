/* @layer tooling-scripts @kind logic */
import { DEBIAN_PACKAGE_PATTERN } from '../platforms/server/server.constants.mjs';
import { INSTALL_STEP_NAME, TEST_ENV_KEYS, TEST_ENV_LABEL, TEST_USERNS_STEP_NAME, USERNS_COMMAND } from './test-env.constants.mjs';

/**
 * @typedef {{ linuxPackages: string[], userNamespaces: boolean }} TestEnv the Linux test job setup of an app
 */

const fail = (field, message) => {
  throw new Error(`${TEST_ENV_LABEL}${field}${message}`);
};

const packagesOf = (value) => {
  if (value === undefined) return [];
  if (!Array.isArray(value)) fail('.linuxPackages', ' is a list.');
  const bad = value.find((name) => typeof name !== 'string' || !DEBIAN_PACKAGE_PATTERN.test(name));
  if (bad !== undefined) fail('.linuxPackages', ` has "${bad}", which is not a Debian package name.`);
  return [...new Set(value)];
};

const flagOf = (value) => {
  if (value !== undefined && typeof value !== 'boolean') fail('.userNamespaces', ' is true or false.');
  return value === true;
};

/**
 * @param {{ testEnv?: { linuxPackages?: string[], userNamespaces?: boolean } } | undefined} workflows workflows of brock.config.ts
 * @returns {TestEnv} the options, checked, with their defaults
 */
const testEnvOf = (workflows) => {
  const value = workflows?.testEnv ?? {};
  if (typeof value !== 'object' || Array.isArray(value)) fail('', ' is an object.');
  const unknown = Object.keys(value).find((key) => !TEST_ENV_KEYS.includes(key));
  if (unknown !== undefined) fail('', ` has "${unknown}"; it takes ${TEST_ENV_KEYS.join(' and ')}.`);
  return { linuxPackages: packagesOf(value.linuxPackages), userNamespaces: flagOf(value.userNamespaces) };
};

/**
 * @param {string} name the step name
 * @returns {string} the user namespace step
 */
const userNamespaceStep = (name) => `      - name: ${name}\n        run: ${USERNS_COMMAND}`;

const installStep = (packages) =>
  `      - name: ${INSTALL_STEP_NAME}\n        run: sudo apt-get update && sudo apt-get install -y --no-install-recommends ${packages.join(' ')}`;

/**
 * @param {TestEnv} testEnv
 * @returns {string} the test job steps, empty when none is set
 */
const testEnvSteps = ({ linuxPackages, userNamespaces }) => [
  ...(linuxPackages.length ? [installStep(linuxPackages)] : []),
  ...(userNamespaces ? [userNamespaceStep(TEST_USERNS_STEP_NAME)] : []),
].map((step) => `\n\n${step}`).join('');

export { testEnvOf, testEnvSteps, userNamespaceStep };
