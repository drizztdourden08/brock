/* @layer tooling-scripts @kind logic */

/** @param {string} source @param {string} name @returns {string | null} the string a const holds */
const constString = (source, name) =>
  new RegExp(`\\bconst\\s+${name}\\s*(?::[^=]+)?=\\s*(['"])([^'"\\n]*)\\1`).exec(source)?.[2] ?? null;

export { constString };
