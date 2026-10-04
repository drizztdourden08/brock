/* @layer tooling-scripts @kind logic */
const DEFAULT_UNIT = '  ';

const splice = (text, start, end, insert) => `${text.slice(0, start)}${insert}${text.slice(end)}`;

const lineIndent = (text, index) => {
  const lineStart = text.lastIndexOf('\n', index - 1) + 1;
  return /^[ \t]*/.exec(text.slice(lineStart))[0];
};

const indentUnit = (text) => {
  const indents = [...text.matchAll(/\n([ \t]+)\S/g)].map((match) => match[1]);
  return indents.reduce((best, indent) => (best === null || indent.length < best.length ? indent : best), null) ?? DEFAULT_UNIT;
};

const reindent = (valueText, from, to) => valueText.split('\n').map((line, i) => (i > 0 && line.startsWith(from) ? `${to}${line.slice(from.length)}` : line)).join('\n');

const rename = (text, member, key) => splice(text, member.keyStart, member.keyEnd, JSON.stringify(key));

const remove = (text, object, member) => {
  const at = object.members.indexOf(member);
  const next = object.members[at + 1];
  if (next) return splice(text, member.keyStart, next.keyStart, '');
  const previous = object.members[at - 1];
  if (previous) return splice(text, previous.value.end, member.value.end, '');
  return splice(text, object.start + 1, object.end - 1, '');
};

const memberText = (key, valueText) => `${JSON.stringify(key)}: ${valueText}`;

const appendTo = (text, object, entry) => {
  const last = object.members.at(-1);
  const before = object.members.at(-2)?.value.end ?? object.start + 1;
  const gap = text.slice(before, last.keyStart);
  const separator = gap.includes('\n') ? `,\n${lineIndent(text, last.keyStart)}` : `,${gap.replace(/^,/, '') || ' '}`;
  return splice(text, last.value.end, last.value.end, `${separator}${entry}`);
};

const fillEmpty = (text, object, entry) => {
  const outer = lineIndent(text, object.start);
  return splice(text, object.start + 1, object.end - 1, `\n${outer}${indentUnit(text)}${entry}\n${outer}`);
};

/**
 * @param {string} text the file
 * @param {Record<string, any>} object the object node to add to
 * @param {{ key: string, value: string, indent?: string }} entry indent: where the value came from
 * @returns {string}
 */
const insert = (text, object, { key, value, indent = '' }) => {
  const filled = object.members.length > 0;
  const target = filled ? lineIndent(text, object.members.at(-1).keyStart) : `${lineIndent(text, object.start)}${indentUnit(text)}`;
  const entry = memberText(key, reindent(value, indent, target));
  return filled ? appendTo(text, object, entry) : fillEmpty(text, object, entry);
};

const jsonEdits = Object.freeze({ rename, remove, insert, lineIndent });

export { jsonEdits };
