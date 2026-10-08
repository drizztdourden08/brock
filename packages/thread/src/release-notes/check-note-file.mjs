/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { checkReleaseNote } from './check-note.mjs';
import { noteRulesFor } from './note-rules.mjs';
import { NOTES_DIR } from './release-notes.constants.mjs';

/**
 * @param {string} version with or without the v
 * @returns {string} the note's path from the repo root
 */
const notePath = (version) => `${NOTES_DIR}/v${version.replace(/^v/, '')}.md`;

/**
 * @param {{ rootDir: string, version: string, product?: string, sections?: string[] }} input rootDir is the repo root
 * @returns {string[]} one line per finding, the file and line first
 */
const checkNoteFile = ({ rootDir, version, product, sections }) => {
  const file = notePath(version);
  const target = join(rootDir, file);
  if (!existsSync(target)) return [`${file}: missing. Every release has a note, written and committed before the release.`];
  const rules = noteRulesFor(rootDir, { product, sections });
  return checkReleaseNote(readFileSync(target, 'utf8'), { ...rules, version: version.replace(/^v/, '') })
    .map(({ line, message }) => `${file}:${line}  ${message}`);
};

export { checkNoteFile, notePath };
