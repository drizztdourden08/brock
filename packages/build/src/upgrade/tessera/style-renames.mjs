/* @layer tooling-scripts @kind logic */
import { renameTodos } from './rename-todos.mjs';
import { renameTokens } from './rename-tokens.mjs';
import { renameValue } from './rename-value.mjs';

const MASKED = /\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|url\([^)]*\)/g;

const selectorRule = (map) => ({ map, kind: 'cssSelector', isName: renameValue.classes, render: (value) => value.split(' ').join('.') });

const propertyRule = (map) => ({ map, kind: 'customProperty', isName: renameValue.customProperty });

const segmentsOf = (text) => {
  const segments = [];
  let at = 0;
  for (const match of text.matchAll(MASKED)) {
    segments.push({ start: at, text: text.slice(at, match.index), code: true }, { start: match.index, text: match[0], code: false });
    at = match.index + match[0].length;
  }
  return [...segments, { start: at, text: text.slice(at), code: true }];
};

const shifted = (found, start) => found.map((item) => ({ ...item, index: item.index + start }));

const renameSelectors = (text, map) => {
  const found = { notes: [], prefixes: [] };
  const pieces = segmentsOf(text).map((segment) => {
    if (!segment.code) return segment.text;
    const result = renameTokens(segment.text, selectorRule(map));
    found.notes.push(...shifted(result.notes, segment.start));
    found.prefixes.push(...shifted(result.prefixes, segment.start));
    return result.text;
  });
  return { text: pieces.join(''), found };
};

/**
 * @param {string} source a stylesheet
 * @param {Record<string, any>} release one RENAMES.json release
 * @returns {{ source: string, todos: { line: number, message: string }[] }}
 */
const styleRenames = (source, release) => {
  const properties = renameTokens(source, propertyRule(release.cssCustomProperties ?? {}));
  const selectors = renameSelectors(properties.text, release.cssClasses ?? {});
  return {
    source: selectors.text,
    todos: [
      ...renameTodos.tokenTodos(source, release.version, 'custom property', properties),
      ...renameTodos.tokenTodos(properties.text, release.version, 'class', selectors.found),
    ],
  };
};

export { styleRenames };
