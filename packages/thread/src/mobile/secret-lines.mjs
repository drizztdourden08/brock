/* @layer tooling-scripts @kind logic */
import { KEY_ALIAS, SECRET_NAMES } from './mobile.constants.mjs';

/**
 * @param {{ base64: string, password: string }} paths
 * @param {NodeJS.Platform} host
 * @returns {string[]} gh secret set lines; values stay in their files
 */
const secretLines = (paths, host) => {
  const fromFile = host === 'win32'
    ? (name, file) => `gh secret set ${name} --body (Get-Content -Raw '${file}')`
    : (name, file) => `gh secret set ${name} < '${file}'`;
  return [
    fromFile(SECRET_NAMES.keystore, paths.base64),
    fromFile(SECRET_NAMES.password, paths.password),
    `gh secret set ${SECRET_NAMES.alias} --body ${KEY_ALIAS}`,
  ];
};

export { secretLines };
