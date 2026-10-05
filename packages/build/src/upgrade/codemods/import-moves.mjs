/* @layer tooling-scripts @kind logic */
import { loadTypescript } from '../tessera/load-typescript.mjs';
import { tsSource } from '../tessera/ts-source.mjs';

const MENTIONS = /@drizztdourden08\/tessera\/[\w-]/;

const MAX_PASSES = 64;

const moduleOf = (ts, statement) => (statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier) ? statement.moduleSpecifier.text : null);

const importBinding = (ts, statement) => {
  const named = statement.importClause?.namedBindings;
  if (!named || !ts.isNamedImports(named)) return null;
  return { statement, keyword: 'import', list: named, head: statement.importClause.name ?? null, typeOnly: statement.importClause.isTypeOnly === true };
};

const exportBinding = (ts, statement) => {
  const named = statement.exportClause;
  if (!named || !ts.isNamedExports(named) || moduleOf(ts, statement) === null) return null;
  return { statement, keyword: 'export', list: named, head: null, typeOnly: statement.isTypeOnly === true };
};

const bindingOf = (ts, statement) => {
  if (ts.isImportDeclaration(statement)) return importBinding(ts, statement);
  return ts.isExportDeclaration(statement) ? exportBinding(ts, statement) : null;
};

const bindingsOf = (ts, file) => file.statements.map((statement) => bindingOf(ts, statement)).filter((binding) => binding !== null);

const importedName = (specifier) => (specifier.propertyName ?? specifier.name).text;

const sameKind = (ts, other, binding, target) =>
  other !== binding && other.keyword === binding.keyword && other.typeOnly === binding.typeOnly && moduleOf(ts, other.statement) === target;

const textsOf = (file, specifiers) => specifiers.map((specifier) => specifier.getText(file));

const listText = (file, specifiers) => `{ ${textsOf(file, specifiers).join(', ')} }`;

const appendEdits = (file, host, moved) => {
  const present = new Set(textsOf(file, host.list.elements));
  const added = [...new Set(textsOf(file, moved))].filter((text) => !present.has(text));
  if (added.length === 0) return [];
  const last = host.list.elements.at(-1);
  if (!last) return [{ start: host.list.getStart(file), end: host.list.end, text: `{ ${added.join(', ')} }` }];
  return [{ start: last.end, end: last.end, text: `, ${added.join(', ')}` }];
};

const removeEdit = (file, statement) => {
  const newline = file.text.indexOf('\n', statement.end);
  return { start: statement.getStart(file), end: newline === -1 ? file.text.length : newline + 1, text: '' };
};

const keptEdit = (file, binding, kept) => {
  if (kept.length > 0) return { start: binding.list.getStart(file), end: binding.list.end, text: listText(file, kept) };
  if (binding.head) return { start: binding.head.end, end: binding.list.end, text: '' };
  return removeEdit(file, binding.statement);
};

const newStatement = (file, binding, moved, target) => {
  const quote = binding.statement.moduleSpecifier.getText(file)[0];
  return `\n${binding.keyword} ${binding.typeOnly ? 'type ' : ''}${listText(file, moved)} from ${quote}${target}${quote};`;
};

const retarget = (file, statement, target) => ({ start: statement.moduleSpecifier.getStart(file) + 1, end: statement.moduleSpecifier.end - 1, text: target });

const moveTo = (ctx, binding, target, moved) => {
  const { ts, file, bindings } = ctx;
  const kept = binding.list.elements.filter((specifier) => !moved.includes(specifier));
  const host = bindings.find((other) => sameKind(ts, other, binding, target));
  if (kept.length === 0 && !binding.head && !host) return [retarget(file, binding.statement, target)];
  const listEdit = keptEdit(file, binding, kept);
  if (host) return [listEdit, ...appendEdits(file, host, moved)];
  return [listEdit, { start: binding.statement.end, end: binding.statement.end, text: newStatement(file, binding, moved, target) }];
};

const bindingEdits = (ctx, binding, moves) => {
  const from = moduleOf(ctx.ts, binding.statement);
  for (const move of moves.filter((entry) => entry.from === from && entry.to !== from)) {
    const moved = binding.list.elements.filter((specifier) => move.names.has(importedName(specifier)));
    if (moved.length > 0) return moveTo(ctx, binding, move.to, moved);
  }
  return [];
};

const firstEdits = (ts, file, moves) => {
  const bindings = bindingsOf(ts, file);
  for (const binding of bindings) {
    const edits = bindingEdits({ ts, file, bindings }, binding, moves);
    if (edits.length > 0) return edits;
  }
  return [];
};

const settle = (ts, path, source, moves) => {
  let current = source;
  for (let pass = 0; pass < MAX_PASSES; pass += 1) {
    const edits = firstEdits(ts, tsSource.parse(ts, path, current), moves);
    if (edits.length === 0) return current;
    current = tsSource.applyEdits(current, edits);
  }
  return current;
};

/**
 * @param {{ moves: readonly { from: string, to: string, names: ReadonlySet<string> }[], noTypescript: string, ts?: typeof import('typescript') }} spec ts: a compiler already loaded
 * @returns {(file: { path: string, source: string }) => { source: string, todos: { line: number, message: string }[] }}  moves the named imports and re-exports to their new entry
 */
const importMoves = ({ moves, noTypescript, ts: loaded }) => ({ path, source }) => {
  if (moves.length === 0 || !MENTIONS.test(source)) return { source, todos: [] };
  const ts = loaded ?? loadTypescript(process.cwd());
  if (!ts) return { source, todos: [{ line: 1, message: noTypescript }] };
  return { source: settle(ts, path, source, moves), todos: [] };
};

export { importMoves };
