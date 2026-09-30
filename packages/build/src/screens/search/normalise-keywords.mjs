/* @layer tooling-scripts @kind logic */
const EDGE_PUNCTUATION = /^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu;

/** @param {string} text */
const fold = (text) => text.normalize('NFD').replace(/\p{M}+/gu, '').toLowerCase();

/**
 * @param {unknown} value a string, a list of strings, or anything else (read as none)
 * @returns {string[]} folded words, each once
 */
const normaliseKeywords = (value) => {
  const list = Array.isArray(value) ? value : [value];
  const words = list.filter((item) => typeof item === 'string').flatMap((item) => fold(item).split(/[\s,;/|]+/));
  return [...new Set(words.map((word) => word.replace(EDGE_PUNCTUATION, '')).filter((word) => word !== ''))];
};

export { normaliseKeywords };
