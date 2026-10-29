/* @layer tooling-scripts @kind logic */

/**
 * @param {Function} exec the runner seam
 * @param {string} command
 * @param {string[]} args
 * @param {string} cwd
 * @returns {string | null} the trimmed output, null when the command failed
 */
const attempt = (exec, command, args, cwd) => {
  try {
    return String(exec(command, args, { cwd })).trim();
  } catch {
    return null;
  }
};

/**
 * @param {unknown} text command output
 * @returns {string | null} the last non-empty line
 */
const lastLine = (text) =>
  String(text ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .pop() ?? null;

export { attempt, lastLine };
