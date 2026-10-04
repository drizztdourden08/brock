/* @layer tooling-scripts @kind logic */
import { closingIndex } from '../codemods/closing-index.mjs';

const DECLARATION = /\bconst\s+([A-Za-z_$][\w$]*)\s*(?::[^=]+)?=\s*\[/g;

const removeItem = (source, start, end) => {
  const tail = /^\s*,?[ \t]*\n?/.exec(source.slice(end))?.[0] ?? '';
  const lineStart = source.lastIndexOf('\n', start - 1) + 1;
  const from = source.slice(lineStart, start).trim() === '' ? lineStart : start;
  return `${source.slice(0, from)}${source.slice(end + tail.length)}`;
};

const listAround = (source, at) => [...source.matchAll(DECLARATION)].map((match) => {
  const open = match.index + match[0].length - 1;
  return { name: match[1], start: match.index, open, close: closingIndex(source, open, '[]') };
}).find((list) => list.open < at && list.close > at) ?? null;

const withoutDeclaration = (source, list) => {
  const end = list.close + 1 + (/^;?[ \t]*\n?/.exec(source.slice(list.close + 1))?.[0].length ?? 0);
  const exported = `${source.slice(0, list.start)}${source.slice(end)}`.replace(/\n{3,}/g, '\n\n');
  return exported.replace(/export\s*\{([^}]*)\};?\n?/, (line, names) => {
    const kept = names.split(',').map((part) => part.trim()).filter((part) => part !== '' && part !== list.name);
    return kept.length === 0 ? '' : `export { ${kept.join(', ')} };\n`;
  });
};

/**
 * @param {string} source
 * @param {{ start: number, end: number }} call
 * @returns {{ source: string, emptied: string | null }} emptied names a list now gone
 */
const withoutListItem = (source, call) => {
  const list = listAround(source, call.start);
  const removed = removeItem(source, call.start, call.end);
  if (list === null) return { source: removed, emptied: null };
  const after = listAround(removed, list.open + 1);
  if (after === null || removed.slice(after.open + 1, after.close).replace(/[\s,]/g, '') !== '') return { source: removed, emptied: null };
  return { source: withoutDeclaration(removed, after), emptied: list.name };
};

export { withoutListItem };
