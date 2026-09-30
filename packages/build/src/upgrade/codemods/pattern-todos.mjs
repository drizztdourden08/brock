/* @layer tooling-scripts @kind logic */

const lineAt = (source, index) => source.slice(0, index).split('\n').length;

/**
 * @param {string} source
 * @param {{ pattern: RegExp, message: string, near?: RegExp }[]} rules
 * @returns {{ line: number, message: string }[]} one to-do per match
 */
const patternTodos = (source, rules) =>
  rules
    .filter((rule) => !rule.near || rule.near.test(source))
    .flatMap((rule) => [...source.matchAll(rule.pattern)].map((match) => ({ line: lineAt(source, match.index), message: rule.message })));

export { patternTodos };
