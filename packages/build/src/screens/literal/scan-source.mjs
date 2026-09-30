/* @layer tooling-scripts @kind logic */
import { CLOSERS, ESCAPES, OPENERS, UNKNOWN } from './literal.constants.mjs';

/** @param {string} src @param {number} from */
const lineEnd = (src, from) => {
  const end = src.indexOf('\n', from);
  return end === -1 ? src.length : end;
};

/** @param {string} src @param {number} from */
const blockEnd = (src, from) => {
  const end = src.indexOf('*/', from + 2);
  return end === -1 ? src.length : end + 2;
};

/** @param {string} src @param {number} from @returns {number} */
const skipSpace = (src, from) => {
  let i = from;
  while (i < src.length) {
    if (/\s/.test(src.charAt(i))) i += 1;
    else if (src.startsWith('//', i)) i = lineEnd(src, i);
    else if (src.startsWith('/*', i)) i = blockEnd(src, i);
    else return i;
  }
  return i;
};

/** @param {string} src @param {number} i */
const escaped = (src, i) => ESCAPES.get(src.charAt(i + 1)) ?? src.charAt(i + 1);

/** @param {string} src @param {number} from @returns {{ value: string, end: number }} */
const readQuoted = (src, from) => {
  const quote = src.charAt(from);
  let i = from + 1;
  let value = '';
  while (i < src.length && src.charAt(i) !== quote) {
    const slash = src.charAt(i) === '\\';
    value += slash ? escaped(src, i) : src.charAt(i);
    i += slash ? 2 : 1;
  }
  return { value, end: i + 1 };
};

/** @param {string} src @param {number} from @returns {{ value: string | symbol, end: number }} */
const readTemplate = (src, from) => {
  let i = from + 1;
  let value = '';
  let plain = true;
  while (i < src.length && src.charAt(i) !== '`') {
    if (src.startsWith('${', i)) {
      plain = false;
      i = skipExpression(src, i + 2) + 1;
    } else {
      const slash = src.charAt(i) === '\\';
      value += slash ? escaped(src, i) : src.charAt(i);
      i += slash ? 2 : 1;
    }
  }
  return { value: plain ? value : UNKNOWN, end: i + 1 };
};

/** @param {string} src @param {number} i @returns {number} */
const skipToken = (src, i) => {
  const ch = src.charAt(i);
  if (ch === "'" || ch === '"') return readQuoted(src, i).end;
  if (ch === '`') return readTemplate(src, i).end;
  if (src.startsWith('//', i)) return lineEnd(src, i);
  if (src.startsWith('/*', i)) return blockEnd(src, i);
  return -1;
};

/** @param {string} src @param {number} from @returns {number} */
const skipExpression = (src, from) => {
  let depth = 0;
  let i = from;
  while (i < src.length) {
    const next = skipToken(src, i);
    const ch = src.charAt(i);
    if (next !== -1) i = next - 1;
    else if (OPENERS.includes(ch)) depth += 1;
    else if (CLOSERS.includes(ch) && depth === 0) return i;
    else if (CLOSERS.includes(ch)) depth -= 1;
    else if (depth === 0 && (ch === ',' || ch === ';')) return i;
    i += 1;
  }
  return i;
};

export { readQuoted, readTemplate, skipExpression, skipSpace, skipToken };
