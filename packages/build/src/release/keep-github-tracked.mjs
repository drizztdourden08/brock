/* @layer tooling-scripts @kind logic */
import { GITHUB_EXCEPTION, GITHUB_IGNORES, GITHUB_UNIGNORES } from './workflows.constants.mjs';

const lastIndexWhere = (lines, set) => lines.reduce((last, line, index) => (set.has(line.trim()) ? index : last), -1);

/**
 * @param {string} source a .gitignore
 * @returns {string | null} with `!.github/` after the hiding rule
 */
const keepGithubTracked = (source) => {
  const eol = source.includes('\r\n') ? '\r\n' : '\n';
  const lines = source.split(/\r?\n/);
  const hidden = lastIndexWhere(lines, GITHUB_IGNORES);
  if (hidden === -1 || lastIndexWhere(lines, GITHUB_UNIGNORES) > hidden) return null;
  lines.splice(hidden + 1, 0, GITHUB_EXCEPTION);
  return lines.join(eol);
};

export { keepGithubTracked };
