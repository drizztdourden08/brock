/* @layer tooling-scripts @kind logic */

/**
 * @typedef {{ code: number, errors: string[], warnings: string[], lines: string[] }} CliResult
 */

/**
 * @param {{ errors?: string[], warnings?: string[], lines?: string[] }} parts what a verb found
 * @returns {CliResult} exit code 1 when there is an error
 */
const cliResult = ({ errors = [], warnings = [], lines = [] }) => ({ code: errors.length ? 1 : 0, errors, warnings, lines });

export { cliResult };
