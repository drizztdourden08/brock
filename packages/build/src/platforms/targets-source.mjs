/* @layer tooling-scripts @kind logic */
import { TARGETS_ARRAY, MODULES_LINE, QUOTED } from './targets-source.constants.mjs';

/**
 * @param {string} source brock.config.ts
 * @returns {string[] | null} null when the file lists no targets
 */
const readTargets = (source) => {
  const body = TARGETS_ARRAY.exec(source)?.[2];
  return body === undefined ? null : [...body.matchAll(QUOTED)].map((match) => match[1]);
};

/**
 * @param {string} source brock.config.ts
 * @param {string[]} targets
 * @returns {string} the source with that targets array
 */
const writeTargets = (source, targets) => {
  const list = targets.map((token) => `'${token}'`).join(', ');
  if (TARGETS_ARRAY.test(source)) return source.replace(TARGETS_ARRAY, `$1${list}$3`);
  if (!MODULES_LINE.test(source)) throw new Error('brock.config.ts has no targets or modules array to write the targets beside');
  return source.replace(MODULES_LINE, `$1targets: [${list}],\n$1modules:`);
};

export { readTargets, writeTargets };
