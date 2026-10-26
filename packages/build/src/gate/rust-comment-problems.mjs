/* @layer tooling-scripts @kind logic */
import { RUST_COMMENT_RULE, RUST_SAFETY, RUST_UNSAFE } from './cargo.constants.mjs';
import { scanRust } from './scan-rust.mjs';

const isDoc = (comment) => !comment.block && !comment.trailing && /^\/\/[/!]/.test(comment.text) && !comment.text.startsWith('////');

const isPlainLine = (comment) => !comment.block && !comment.trailing && !isDoc(comment);

const runsOf = (comments) => comments.filter(isPlainLine).reduce((runs, comment) => {
  const last = runs.at(-1);
  if (last && last.at(-1).line === comment.line - 1) last.push(comment);
  else runs.push([comment]);
  return runs;
}, []);

const safetyLines = (comments, lines) => new Set(runsOf(comments)
  .filter((run) => RUST_SAFETY.test(run[0].text) && RUST_UNSAFE.test(lines[run.at(-1).line] ?? ''))
  .flat()
  .map((comment) => comment.line));

/**
 * @param {string} text the Rust source
 * @returns {{ line: number, message: string }[]} the comments that break the rule
 */
const rustCommentProblems = (text) => {
  const comments = scanRust(text);
  const allowed = safetyLines(comments, text.split('\n'));
  return comments
    .filter((comment) => !isDoc(comment) && !allowed.has(comment.line))
    .map((comment) => ({ line: comment.line, message: `${comment.block ? 'block comment' : 'comment'}: ${RUST_COMMENT_RULE}` }));
};

export { rustCommentProblems };
