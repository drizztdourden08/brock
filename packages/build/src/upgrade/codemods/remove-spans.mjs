/* @layer tooling-scripts @kind logic */

const removeSpan = (source, { start, end }) => {
  const lineStart = source.lastIndexOf('\n', start - 1) + 1;
  const newline = source.indexOf('\n', end);
  const lineEnd = newline === -1 ? source.length : newline + 1;
  const alone = !source.slice(lineStart, start).trim() && !source.slice(end, lineEnd).trim();
  if (alone) return source.slice(0, lineStart) + source.slice(lineEnd);
  const blank = /[ \t]*$/.exec(source.slice(lineStart, start))?.[0].length ?? 0;
  return source.slice(0, start - blank) + source.slice(end);
};

/**
 * @param {string} source
 * @param {{ start: number, end: number }[]} spans
 * @returns {string} without the spans and the lines they empty
 */
const removeSpans = (source, spans) => [...spans].sort((a, b) => b.start - a.start).reduce(removeSpan, source);

export { removeSpans };
