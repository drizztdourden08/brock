/* @layer tooling-scripts @kind logic */
import { loadTypescript, tsSource } from '../../src/upgrade/index.mjs';

const PRIMITIVES = '@drizztdourden08/tessera/primitives';

const COMPOSITES = '@drizztdourden08/tessera/composites';

const MOVES = Object.freeze([
  { from: PRIMITIVES, to: COMPOSITES, names: new Set(['CopyButton', 'CopyButtonProps', 'CopyButtonSize', 'CopyText', 'CopyValue', 'CopyValueProps', 'CopyValueSize', 'CopyValueTruncate']) },
  { from: COMPOSITES, to: PRIMITIVES, names: new Set(['ErrorBoundary', 'ErrorBoundaryProps']) },
]);

const NO_TYPESCRIPT = 'Tessera 0.17 moved CopyButton and CopyValue to @drizztdourden08/tessera/composites and ErrorBoundary to @drizztdourden08/tessera/primitives only. TypeScript is not installed, so this file was not read: move those imports by hand, or import them from @drizztdourden08/tessera.';

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

const moveEdits = ({ ts, file, imports }, statement, move) => {
  const named = namedImports(ts, statement);
  const moved = named.elements.filter((specifier) => move.names.has(importedName(specifier)));
  if (moved.length === 0) return [];
  const kept = named.elements.filter((specifier) => !moved.includes(specifier));
  const host = imports.find((other) => other !== statement && sameKind(ts, other, move.to, typeOnly(statement)));
  if (kept.length === 0 && !host) return [{ start: statement.moduleSpecifier.getStart(file) + 1, end: statement.moduleSpecifier.end - 1, text: move.to }];
  const listEdit = kept.length === 0 ? removeEdit(file, statement) : { start: named.getStart(file), end: named.end, text: listText(file, kept) };
  if (host) return [listEdit, appendEdit(ts, file, host, moved)];
  return [listEdit, { start: statement.end, end: statement.end, text: newImport(file, statement, moved, move.to) }];
};

const editsOf = (ts, file) => {
  const imports = importsOf(ts, file);
  return imports.flatMap((statement) => {
    const move = MOVES.find((entry) => entry.from === moduleOf(ts, statement));
    return move ? moveEdits({ ts, file, imports }, statement, move) : [];
  });
};

const MENTIONS = /@drizztdourden08\/tessera\/(primitives|composites)/;

const apply = ({ path, source }) => {
  if (!MENTIONS.test(source)) return { source, todos: [] };
  const ts = loadTypescript(process.cwd());
  if (!ts) return { source, todos: [{ line: 1, message: NO_TYPESCRIPT }] };
  return { source: tsSource.applyEdits(source, editsOf(ts, tsSource.parse(ts, path, source))), todos: [] };
};

const migration = Object.freeze({
  id: 'tessera-part-moves',
  summary: 'Tessera 0.17 moved CopyButton, CopyValue and their types from /primitives to /composites, and ErrorBoundary to /primitives only. Imports of them through the old entry point move to the new one; the root import is left alone.',
  files: /(^|\/)src\/.+\.[cm]?[jt]sx?$/,
  apply,
});

export { migration };
