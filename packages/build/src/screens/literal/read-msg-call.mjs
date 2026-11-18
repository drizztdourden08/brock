/* @layer tooling-scripts @kind logic */
const MSG_CALL = /msg\(\s*(['"])([^'"\\\n]*)\1\s*\)/y;

/**
 * @param {string} src a module's source text, never run
 * @param {number} from where a value starts
 * @returns {{ value: { key: string }, end: number } | null} the key of a msg('ns:key') call, or null when there is none here
 */
const readMsgCall = (src, from) => {
  MSG_CALL.lastIndex = from;
  const match = MSG_CALL.exec(src);
  return match ? { value: { key: match[2] ?? '' }, end: MSG_CALL.lastIndex } : null;
};

export { readMsgCall };
