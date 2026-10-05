/* @layer tooling-scripts @kind logic */
import { loadTypescript } from '../tessera/load-typescript.mjs';
import { tsSource } from '../tessera/ts-source.mjs';

const MENTIONS = /@drizztdourden08\/tessera\/(primitives|composites|brand)/;

const MAX_PASSES = 64;

const moduleOf = (ts, statement) => (ts.isStringLiteral(statement.moduleSpecifier) ? statement.moduleSpecifier.text : null);

const namedImports = (ts, statement) => {
  const named = statement.importClause?.namedBindings;
  return named && ts.isNamedImports(named) && !statement.importClause.name ? named : null;
};

const importsOf = (ts, file) => file.statements.filter((statement) => ts.isImportDeclaration(statement) && namedImports(ts, statement) !== null);

const importedName = (specifier) => (specifier.propertyName ?? specifier.name).text;

const typeOnly = (statement) => statement.importClause.isTypeOnly === true;

const sameKind = (ts, statement, target, isType) => moduleOf(ts, statement) === target && typeOnly(statement) === isType;

const listText = (file, specifiers) => `{ ${specifiers.map((specifier) => specifier.getText(file)).join(', ')} }`;

const appendEdit = (ts, file, statement, moved) => {
  const elements = namedImports(ts, statement).elements;
  const last = elements[elements.length - 1];
  return { start: last.end, end: last.end, text: `, ${moved.map((specifier) => specifier.getText(file)).join(', ')}` };
};

const removeEdit = (file, statement) => {
  const newline = file.text.indexOf('\n', statement.end);
  return { start: statement.getStart(file), end: newline === -1 ? file.text.length : newline + 1, text: '' };
};

const newImport = (file, statement, moved, target) =>
  `\nimport ${typeOnly(statement) ? 'type ' : ''}${listText(file, moved)} from '${target}';`;

const moveTo = (ctx, statement, target, moved) => {
  const { ts, file, imports } = ctx;
  const named = namedImports(ts, statement);
  const kept = named.elements.filter((specifier) => !moved.includes(specifier));
  const host = imports.find((other) => other !== statement && sameKind(ts, other, target, typeOnly(statement)));
  if (kept.length === 0 && !host) return [{ start: statement.moduleSpecifier.getStart(file) + 1, end: statement.moduleSpecifier.end - 1, text: target }];
  const listEdit = kept.length === 0 ? removeEdit(file, statement) : { start: named.getStart(file), end: named.end, text: listText(file, kept) };
  if (host) return [listEdit, appendEdit(ts, file, host, moved)];
  return [listEdit, { start: statement.end, end: statement.end, text: newImport(file, statement, moved, target) }];
};

const statementEdits = (ctx, statement, moves) => {
  const from = moduleOf(ctx.ts, statement);
  const elements = namedImports(ctx.ts, statement).elements;
  for (const move of moves.filter((entry) => entry.from === from)) {
    const moved = elements.filter((specifier) => move.names.has(importedName(specifier)));
    if (moved.length > 0) return moveTo(ctx, statement, move.to, moved);
  }
  return [];
};

const firstEdits = (ts, file, moves) => {
  const imports = importsOf(ts, file);
  for (const statement of imports) {
    const edits = statementEdits({ ts, file, imports }, statement, moves);
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
 * @param {{ moves: readonly { from: string, to: string, names: ReadonlySet<string> }[], noTypescript: string }} spec
 * @returns {(file: { path: string, source: string }) => { source: string, todos: { line: number, message: string }[] }}  moves the named imports to their new entry
 */
const importMoves = ({ moves, noTypescript }) => ({ path, source }) => {
  if (!MENTIONS.test(source)) return { source, todos: [] };
  const ts = loadTypescript(process.cwd());
  if (!ts) return { source, todos: [{ line: 1, message: noTypescript }] };
  return { source: settle(ts, path, source, moves), todos: [] };
};

export { importMoves };
