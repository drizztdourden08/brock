/* @layer tooling-scripts @kind logic */
import { EXPORT_DEFAULT, UNKNOWN } from './literal.constants.mjs';
import { readValue } from './read-value.mjs';
import { skipSpace, skipToken } from './scan-source.mjs';

/** @param {number} depth @param {string} ch */
const typeDepth = (depth, ch) => {
  if ('<([{'.includes(ch)) return depth + 1;
  return '>)]}'.includes(ch) ? depth - 1 : depth;
};

/** @param {string} src @param {number} from @returns {number} */
const afterAnnotation = (src, from) => {
  let depth = 0;
  let i = from;
  while (i < src.length) {
    const next = skipToken(src, i);
    const ch = src.charAt(i);
    const arrow = src.startsWith('=>', i);
    if (ch === '=' && !arrow && depth === 0) return i + 1;
    depth = next === -1 && !arrow ? typeDepth(depth, ch) : depth;
    i = next === -1 ? i + (arrow ? 2 : 1) : next;
  }
  return -1;
};

/** @param {string} src @param {string} name @returns {number} */
const valueStart = (src, name) => {
  const match = new RegExp(`\\b(?:const|let|var)\\s+${name}\\b`).exec(src);
  if (!match) return -1;
  const at = skipSpace(src, match.index + match[0].length);
  if (src.charAt(at) === '=') return at + 1;
  return src.charAt(at) === ':' ? afterAnnotation(src, at + 1) : -1;
};

/** @param {string} src @param {string} name @param {ReadonlySet<string>} seen @returns {unknown} */
const readDeclared = (src, name, seen) => {
  const start = valueStart(src, name);
  if (start === -1) return UNKNOWN;
  const inner = new Set([...seen, name]);
  return readValue(src, start, (ref) => (inner.has(ref) ? UNKNOWN : readDeclared(src, ref, inner))).value;
};

/**
 * @param {string} src a module's source text, never run
 * @param {string} name an exported name, or 'default'
 * @returns {unknown} the value, UNKNOWN where it is not a literal
 */
const readExport = (src, name) => {
  if (name !== 'default') return readDeclared(src, name, new Set());
  const match = EXPORT_DEFAULT.exec(src);
  if (!match) return UNKNOWN;
  return readValue(src, match.index + match[0].length, (ref) => readDeclared(src, ref, new Set())).value;
};

export { readExport };
