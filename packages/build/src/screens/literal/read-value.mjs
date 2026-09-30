/* @layer tooling-scripts @kind logic */
import { IDENTIFIER, NUMBER, TERMINATORS, TYPE_SUFFIX, UNKNOWN, WORD_VALUES } from './literal.constants.mjs';
import { readQuoted, readTemplate, skipExpression, skipSpace } from './scan-source.mjs';

/**
 * @typedef {(name: string) => unknown} Resolve
 * @typedef {{ value: unknown, end: number }} Read
 */

/** @param {RegExp} pattern @param {string} src @param {number} i */
const sticky = (pattern, src, i) => {
  pattern.lastIndex = i;
  return pattern.exec(src)?.[0] ?? null;
};

/** @param {string} src @param {number} i */
const readKey = (src, i) => {
  const ch = src.charAt(i);
  if (ch === "'" || ch === '"') {
    const { value, end } = readQuoted(src, i);
    return { name: value, end };
  }
  const word = sticky(IDENTIFIER, src, i) ?? sticky(NUMBER, src, i);
  return word === null ? null : { name: word, end: i + word.length };
};

/** @param {string} src @param {number} i @param {Resolve} resolve @param {Record<string, unknown>} out @returns {number} */
const readMember = (src, i, resolve, out) => {
  const key = readKey(src, i);
  const after = key === null ? i : skipSpace(src, key.end);
  if (key !== null && src.charAt(after) === ':') {
    const { value, end } = readValue(src, after + 1, resolve);
    out[key.name] = value;
    return end;
  }
  if (key !== null && (src.charAt(after) === ',' || src.charAt(after) === '}')) {
    out[key.name] = resolve(key.name);
    return after;
  }
  return Math.max(skipExpression(src, i), i + 1);
};

/** @param {string} src @param {number} from @param {string} close @param {(i: number) => number} step @returns {number} */
const readList = (src, from, close, step) => {
  let i = skipSpace(src, from + 1);
  while (i < src.length && src.charAt(i) !== close) {
    const end = skipSpace(src, step(i));
    if (src.charAt(end) !== ',') return end;
    i = skipSpace(src, end + 1);
  }
  return i;
};

/** @param {string} src @param {number} from @param {Resolve} resolve @returns {Read} */
const readObject = (src, from, resolve) => {
  const out = {};
  const end = readList(src, from, '}', (i) => readMember(src, i, resolve, out));
  return { value: out, end: end + 1 };
};

/** @param {string} src @param {number} from @param {Resolve} resolve @returns {Read} */
const readArray = (src, from, resolve) => {
  const out = [];
  const end = readList(src, from, ']', (i) => {
    const item = src.startsWith('...', i) ? { value: UNKNOWN, end: skipExpression(src, i) } : readValue(src, i, resolve);
    out.push(item.value);
    return item.end;
  });
  return { value: out, end: end + 1 };
};

/** @param {string} src @param {number} i @param {Resolve} resolve @returns {Read} */
const readWord = (src, i, resolve) => {
  const number = sticky(NUMBER, src, i);
  if (number !== null) return { value: Number(number), end: i + number.length };
  const word = sticky(IDENTIFIER, src, i);
  if (word === null) return { value: UNKNOWN, end: skipExpression(src, i) };
  const value = WORD_VALUES.has(word) ? WORD_VALUES.get(word) : resolve(word);
  return { value, end: i + word.length };
};

/** @param {string} src @param {number} i @param {Resolve} resolve @returns {Read} */
const readPrimary = (src, i, resolve) => {
  const ch = src.charAt(i);
  if (ch === '{') return readObject(src, i, resolve);
  if (ch === '[') return readArray(src, i, resolve);
  if (ch === "'" || ch === '"') return readQuoted(src, i);
  if (ch === '`') return readTemplate(src, i);
  return readWord(src, i, resolve);
};

/** @param {string} src @param {number} from @param {Resolve} resolve @returns {Read} */
const readValue = (src, from, resolve) => {
  const start = skipSpace(src, from);
  const primary = readPrimary(src, start, resolve);
  const after = skipSpace(src, primary.end);
  if (after >= src.length || TERMINATORS.includes(src.charAt(after))) return { value: primary.value, end: after };
  if (TYPE_SUFFIX.test(src.slice(after, after + 10))) return { value: primary.value, end: skipExpression(src, after) };
  return { value: UNKNOWN, end: skipExpression(src, start) };
};

export { readValue };
