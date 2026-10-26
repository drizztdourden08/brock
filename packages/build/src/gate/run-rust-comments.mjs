/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { relative } from 'node:path';
import { rustCommentProblems } from './rust-comment-problems.mjs';
import { rustFiles } from './rust-files.mjs';

/**
 * @param {{ dir: string, log?: (line: string) => void }} opts
 * @returns {number} exit code, 1 when a comment breaks the rule
 */
const runRustComments = ({ dir, log = console.log }) => {
  const files = rustFiles(dir);
  let found = 0;
  for (const file of files) {
    for (const { line, message } of rustCommentProblems(readFileSync(file, 'utf8'))) {
      log(`  ${relative(dir, file).replace(/\\/g, '/')}:${line}: ${message}`);
      found += 1;
    }
  }
  log(`rust comments: ${found} problem(s) in ${files.length} file(s)`);
  return found ? 1 : 0;
};

export { runRustComments };
