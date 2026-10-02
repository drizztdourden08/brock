/* @layer tooling-scripts @kind logic */
const escaped = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const statementsFrom = (source, module) => {
  const pattern = new RegExp(String.raw`^import\s+(type\s+)?\{([^}]*)\}\s+from\s+(['"])${escaped(module)}\3;?[ \t]*\r?\n?`, 'gm');
  return [...source.matchAll(pattern)].map((match) => ({
    start: match.index,
    end: match.index + match[0].length,
    type: Boolean(match[1]),
    names: match[2].split(',').map((name) => name.trim()).filter(Boolean),
  }));
};

const mergeKind = (source, statements, module) => {
  if (statements.length < 2) return source;
  const names = [...new Set(statements.flatMap((statement) => statement.names))];
  const merged = `import ${statements[0].type ? 'type ' : ''}{ ${names.join(', ')} } from '${module}';\n`;
  let out = source;
  for (const statement of [...statements].reverse()) out = out.slice(0, statement.start) + (statement === statements[0] ? merged : '') + out.slice(statement.end);
  return out;
};

/**
 * @param {string} source
 * @param {string} module
 * @returns {string} one value and one type import of module
 */
const mergeImports = (source, module) => {
  const once = mergeKind(source, statementsFrom(source, module).filter((statement) => statement.type), module);
  return mergeKind(once, statementsFrom(once, module).filter((statement) => !statement.type), module);
};

export { mergeImports };
