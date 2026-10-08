/* @layer tooling-scripts @kind logic */
import { checkRepoNotes, NOTES_DIR } from '@drizztdourden08/standards/release-notes';

/**
 * @param {string} version with or without the v
 * @returns {string} the note's path from the repo root
 */
const notePath = (version) => `${NOTES_DIR}/v${version.replace(/^v/, '')}.md`;

/**
 * @param {{ rootDir: string, version: string, product?: string, sections?: string[] }} input rootDir is the repo root
 * @returns {string[]} one line per finding
 */
const checkNoteFile = ({ rootDir, version, product, sections }) =>
  checkRepoNotes({ rootDir, version: version.replace(/^v/, ''), product, sections }).findings;

export { checkNoteFile, notePath };
