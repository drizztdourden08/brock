/* @layer tooling-scripts @kind logic */
import { EXPORT_DEFAULT, NAMED_DEFAULT, UNKNOWN } from './literal.constants.mjs';
import { readExport } from './read-export.mjs';
import { readValue } from './read-value.mjs';

/** @param {string} src @param {string} name @returns {number} where that const's value starts */
const declaredAt = (src, name) => {
  const match = new RegExp(`\\b(?:const|let|var)\\s+${name}\\b[^=]*=`).exec(src);
  return match ? match.index + match[0].length : -1;
};

/** @param {string} src @returns {number} where the default export's value starts */
const defaultAt = (src) => {
  const match = EXPORT_DEFAULT.exec(src);
  if (!match) return -1;
  const at = match.index + match[0].length;
  const named = NAMED_DEFAULT.exec(src.slice(at));
  return named ? declaredAt(src, named[1]) : at;
};

/**
 * @param {string} src a module's source text, never run
 * @param {string} callee the define helper, such as defineTour
 * @returns {unknown} the helper's literal argument, or UNKNOWN
 */
const readDefinedDefault = (src, callee) => {
  const start = defaultAt(src);
  if (start === -1) return UNKNOWN;
  const call = new RegExp(`^\\s*${callee}\\s*(?:<[^>(]*>)?\\s*\\(`).exec(src.slice(start));
  const from = call ? start + call[0].length : start;
  return readValue(src, from, (ref) => readExport(src, ref)).value;
};

export { readDefinedDefault };
