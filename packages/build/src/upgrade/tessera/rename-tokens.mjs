/* @layer tooling-scripts @kind logic */

const BOUNDARIES = Object.freeze({
  customProperty: { before: '(?<![\\w-])', after: '(?![\\w-])' },
  classToken: { before: '(?<![^\\s])', after: '(?![^\\s])' },
  cssSelector: { before: '(?<=(?<![\\\\-])\\.)', after: '(?![\\w-])' },
  stringSelector: { before: '(?<=(?<![\\w/\\\\.-])\\.)', after: '(?![\\w-])' },
});

const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const alternation = (keys) => [...keys].sort((a, b) => b.length - a.length || a.localeCompare(b)).map(escape).join('|');

const patternsFor = (map, kind) => {
  const keys = alternation(Object.keys(map));
  const { before, after } = BOUNDARIES[kind];
  return { exact: new RegExp(`${before}(${keys})${after}`, 'g'), prefix: new RegExp(`${before}(${keys})([-_][\\w-]*)`, 'g') };
};

const prefixesIn = (text, map, pattern) =>
  [...text.matchAll(pattern)]
    .filter((match) => !Object.hasOwn(map, match[1] + match[2]))
    .map((match) => ({ index: match.index, key: match[1], value: map[match[1]], full: match[1] + match[2] }));

/**
 * @param {string} text
 * @param {{ map: Record<string, string>, kind: keyof typeof BOUNDARIES, isName: (value: string) => boolean, render?: (value: string) => string }} rule
 * @returns {{ text: string, notes: { index: number, key: string, value: string }[], prefixes: { index: number, key: string, value: string, full: string }[] }} one pass, longer keys first
 */
const renameTokens = (text, { map, kind, isName, render = (value) => value }) => {
  if (Object.keys(map).length === 0) return { text, notes: [], prefixes: [] };
  const { exact, prefix } = patternsFor(map, kind);
  const notes = [];
  const prefixes = prefixesIn(text, map, prefix);
  const renamed = text.replace(exact, (key, _name, index) => {
    if (isName(map[key])) return render(map[key]);
    notes.push({ index, key, value: map[key] });
    return key;
  });
  return { text: renamed, notes, prefixes };
};

export { renameTokens };
