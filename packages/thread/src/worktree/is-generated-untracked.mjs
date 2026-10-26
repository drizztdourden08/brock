/* @layer tooling-scripts @kind logic */
import { GENERATED_UNTRACKED } from './generated-files.constants.mjs';

const UNTRACKED_PREFIX = '?? ';

/**
 * @param {string} line one line of `git status --porcelain`
 * @returns {boolean} true for an untracked generated file
 */
const isGeneratedUntracked = (line) => {
  const text = line.trim();
  return text.startsWith(UNTRACKED_PREFIX) && GENERATED_UNTRACKED.includes(text.slice(UNTRACKED_PREFIX.length));
};

export { isGeneratedUntracked };
