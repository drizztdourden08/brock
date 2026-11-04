/* @layer tooling-scripts @kind logic */
import { git } from '../git.mjs';
import { LISTED_SUBJECTS_MAX } from './push.constants.mjs';

const subjectLines = (commits) => {
  const shown = commits.length <= LISTED_SUBJECTS_MAX ? commits : [commits[0], commits[commits.length - 1]];
  return shown.map((commit) => `  ${commit}`);
};

/**
 * @param {string} path
 * @param {string} branch
 * @param {string | null} upstream
 * @returns {string[]} lines saying what goes up
 */
const pushStatement = (path, branch, upstream) => {
  const range = upstream ? `${upstream}..HEAD` : 'HEAD';
  const commits = git(['log', '--format=%h %s', range], path).split('\n').filter(Boolean);
  const newest = git(['rev-parse', '--short', 'HEAD'], path);
  const oldest = upstream ? git(['rev-parse', '--short', upstream], path) : 'the start';
  const head = `"${branch}" sends ${commits.length} commit(s) ${oldest}..${newest}${upstream ? ` on ${upstream}` : ' (first publish)'}.`;
  return [head, ...subjectLines(commits)];
};

export { pushStatement };
