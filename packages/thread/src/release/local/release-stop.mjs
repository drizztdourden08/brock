/* @layer tooling-scripts @kind logic */
class ReleaseStop extends Error {
  constructor(message, code = 2) {
    super(message);
    this.code = code;
  }
}

/**
 * @param {string} message
 * @param {number} [code] 2 is a setup stop the user can fix, then run again
 * @returns {ReleaseStop}
 */
const stop = (message, code = 2) => new ReleaseStop(message, code);

export { ReleaseStop, stop };
