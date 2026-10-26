/* @layer tooling-scripts @kind logic */
const PREFIX_RULE = /^[a-z0-9][a-z0-9-]*$/i;

/**
 * @param {string} raw a prefix as typed
 * @param {string} source where it came from, for the message
 * @returns {string} the prefix ending in a dash, or empty
 */
const normalizePrefix = (raw, source) => {
  const text = String(raw).trim();
  if (text === '') return '';
  if (!PREFIX_RULE.test(text)) throw new Error(`${source}: "${text}" is not a valid worktree prefix: letters, digits and dashes, starting with a letter or digit.`);
  const lower = text.toLowerCase();
  return lower.endsWith('-') ? lower : `${lower}-`;
};

export { normalizePrefix };
