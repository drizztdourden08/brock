/* @layer tooling-scripts @kind logic */
import { JSX_FACTORY } from './meta-modules.constants.mjs';
import { statementUnit } from './statement-unit.mjs';

/** @param {import('./statement-unit.mjs').Unit} unit @param {Set<string>} used */
const importText = (unit, used) => {
  const { parts, from } = unit;
  const head = [parts.default, parts.namespace].filter((part) => part && used.has(part.local)).map((part) => part.text);
  const named = parts.named.filter((part) => used.has(part.local)).map((part) => part.text);
  const clause = [...head, ...(named.length ? [`{ ${named.join(', ')} }`] : [])];
  return clause.length ? `import ${clause.join(', ')} from ${from};` : '';
};

/**
 * @param {import('./statement-unit.mjs').Unit[]} units
 * @returns {{ kept: Set<import('./statement-unit.mjs').Unit>, used: Set<string> } | null} what the exports reach; null past the default
 */
const reach = (units) => {
  const owner = new Map(units.flatMap((unit) => unit.declares.map((name) => [name, unit])));
  const kept = new Set();
  const used = new Set();
  const queue = units.filter((unit) => unit.exports.length > 0);
  while (queue.length > 0) {
    const unit = queue.pop();
    if (kept.has(unit)) continue;
    kept.add(unit);
    const names = [...unit.refs, ...(unit.jsx ? [JSX_FACTORY] : [])];
    for (const name of names) {
      const source = owner.get(name);
      if (source?.kind === 'dropped' && name !== JSX_FACTORY) return null;
      if (!source || source.kind === 'dropped') continue;
      used.add(name);
      queue.push(source);
    }
  }
  return { kept, used };
};

/**
 * @param {typeof import('typescript')} ts the TypeScript compiler
 * @param {string} fileName the module's path, for its script kind
 * @param {string} source the module's text, never run
 * @param {readonly string[]} wanted the export names to keep
 * @returns {{ code: string, exports: string[] } | null} those exports and what they use, or null
 */
const stripToExports = (ts, fileName, source, wanted) => {
  const kind = /x$/.test(fileName) ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const file = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, kind);
  if (file.parseDiagnostics?.length) return null;
  const units = file.statements.map((statement) => statementUnit(ts, statement, wanted));
  const exports = units.flatMap((unit) => unit.exports);
  if (exports.length === 0) return null;
  const reached = reach(units);
  if (!reached) return null;
  const code = units
    .filter((unit) => reached.kept.has(unit) || (unit.kind === 'import' && unit.declares.some((name) => reached.used.has(name))))
    .map((unit) => (unit.kind === 'import' ? importText(unit, reached.used) : unit.text))
    .filter(Boolean);
  return { code: `${code.join('\n')}\n`, exports };
};

export { stripToExports };
