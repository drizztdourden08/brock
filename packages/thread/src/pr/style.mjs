/* @layer tooling-scripts @kind logic */
import { findSlop } from '@drizztdourden08/standards/writing';

const MAX_LISTED = 5;

const POLICY = [
  {
    test: /\[sync-ack\]/i,
    why: 'carries [sync-ack]. That marker is the maintainer\'s approval to give and never the assistant\'s to type. Hand the drift report back instead.',
  },
  {
    test: /^\s*co-authored-by:|^\W*generated (?:with|by)\b|\u{1F916}/imu,
    why: 'carries an attribution or co-author line. This project does not want them in commit messages or PR descriptions. Delete the line.',
  },
];

const assertPolicy = (text, what) => {
  const broken = POLICY.find(({ test }) => test.test(text));
  if (broken) throw new Error(`${what} ${broken.why}`);
};

const assertSlopFree = (text, what) => {
  const hits = findSlop(text);
  if (hits.length === 0) return;
  const listed = hits.slice(0, MAX_LISTED).map((hit) => `  - ${hit.message}`);
  const more = hits.length > listed.length ? `\n  ...and ${hits.length - listed.length} more` : '';
  throw new Error(`${what} breaks the house writing style:\n${listed.join('\n')}${more}`);
};

/**
 * @param {string} text
 * @param {string} what names the field, for the message
 * @param {import('../workspace/workspace.type.mjs').Workspace} workspace
 * @returns {void}
 */
const checkPublishStyle = (text, what, workspace) => {
  if (!text) return;
  assertPolicy(text, what);
  if (workspace.publish.prStyle === 'house') assertSlopFree(text, what);
};

export { checkPublishStyle };
