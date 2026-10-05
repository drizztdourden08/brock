/* @layer tooling-scripts @kind logic */
const RECURSIVE = new Set(['-r', '--recursive']);
const FILTER = /^(?:-F|--filter)(?:=|$)/;
const SEPARATOR = /&&|\|\||;/;

const runsEverywhere = (command, script) => {
  const words = command.trim().split(/\s+/);
  return words[0] === 'pnpm' && words.some((word) => RECURSIVE.has(word)) && !words.some((word) => FILTER.test(word)) && words.includes(script);
};

/**
 * @param {string | undefined} rootScript  The root package.json script of that name
 * @param {string} script  The script name, as lint or test
 * @returns {boolean}  True when the root script runs that script in every package (pnpm -r, no --filter)
 */
const coversEveryPackage = (rootScript, script) =>
  typeof rootScript === 'string' && rootScript.split(SEPARATOR).some((command) => runsEverywhere(command, script));

export { coversEveryPackage };
