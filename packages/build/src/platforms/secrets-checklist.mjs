/* @layer tooling-scripts @kind logic */
import { resolvePlatforms } from './resolve-platforms.mjs';

/**
 * @param {string[]} targets ids and bundles
 * @returns {string[]} the release secrets, and how to make them
 */
const secretsChecklist = (targets) =>
  resolvePlatforms(targets).platforms
    .filter((platform) => platform.secrets.length)
    .flatMap((platform) => [
      `  ${platform.label} release secrets (GitHub repository secrets):`,
      ...platform.secrets.map((secret) => `    ${secret.name.padEnd(26)} ${secret.about}`),
      ...(platform.secretsHint ? [`    To make them, ${platform.secretsHint}.`] : []),
    ]);

export { secretsChecklist };
