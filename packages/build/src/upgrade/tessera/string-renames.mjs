/* @layer tooling-scripts @kind logic */
import { CLASS_ATTRIBUTE, CLASS_HOLDER } from './tessera-renames.constants.mjs';
import { renameTodos } from './rename-todos.mjs';
import { renameTokens } from './rename-tokens.mjs';
import { renameValue } from './rename-value.mjs';
import { tsSource } from './ts-source.mjs';

const CUT = '-';

const isModuleName = (ts, node) => ts.isImportDeclaration(node.parent) || ts.isExportDeclaration(node.parent) || ts.isExternalModuleReference(node.parent);

const calleeName = (ts, callee) => (ts.isPropertyAccessExpression(callee) ? callee.name.text : callee.getText());

const holdsClasses = (ts, node) => {
  if (ts.isJsxAttribute(node)) return CLASS_ATTRIBUTE.test(node.name.getText());
  if (ts.isCallExpression(node)) return CLASS_HOLDER.test(calleeName(ts, node.expression));
  const named = ts.isVariableDeclaration(node) || ts.isPropertyAssignment(node) || ts.isPropertyDeclaration(node) || ts.isParameter(node);
  return named && ts.isIdentifier(node.name) && CLASS_HOLDER.test(node.name.text);
};

const inClassList = (ts, literal) => {
  for (let node = literal.parent; node && !ts.isBlock(node) && !ts.isSourceFile(node); node = node.parent) {
    if (holdsClasses(ts, node)) return true;
  }
  return false;
};

const classRule = (map, inList) =>
  inList
    ? { map, kind: 'classToken', isName: renameValue.classes }
    : { map, kind: 'stringSelector', isName: renameValue.classes, render: (value) => value.split(' ').join('.') };

const looksLikeClass = (inner, map, inList) => !inList && Object.hasOwn(map, inner.trim());

const renameInner = (text, inner, rule) => {
  const padded = `${inner.open ? CUT : ''}${text}${inner.close ? CUT : ''}`;
  const result = renameTokens(padded, rule);
  const shift = (found) => found.map((item) => ({ ...item, index: item.index - (inner.open ? 1 : 0) + inner.start }));
  return { text: result.text.slice(inner.open ? 1 : 0, result.text.length - (inner.close ? 1 : 0)), notes: shift(result.notes), prefixes: shift(result.prefixes) };
};

const classTodo = (source, inner, map, version) => ({
  line: renameTodos.lineAt(source, inner.start),
  message: `${renameTodos.releaseLabel(version)} renamed the class ${source.slice(inner.start, inner.end).trim()} to "${map[source.slice(inner.start, inner.end).trim()]}". If this string is that class, change it.`,
});

const renameString = (ts, file, node, release) => {
  const inner = tsSource.innerOf(ts, file, node);
  const classes = release.cssClasses ?? {};
  const inList = inClassList(ts, node);
  const properties = renameInner(file.text.slice(inner.start, inner.end), inner, { map: release.cssCustomProperties ?? {}, kind: 'customProperty', isName: renameValue.customProperty });
  const names = renameInner(properties.text, inner, classRule(classes, inList));
  const todos = [
    ...renameTodos.tokenTodos(file.text, release.version, 'custom property', properties),
    ...renameTodos.tokenTodos(file.text, release.version, 'class', names),
    ...(looksLikeClass(names.text, classes, inList) && !inner.open && !inner.close ? [classTodo(file.text, inner, classes, release.version)] : []),
  ];
  const changed = names.text !== file.text.slice(inner.start, inner.end);
  return { edits: changed ? [{ start: inner.start, end: inner.end, text: names.text }] : [], todos };
};

/**
 * @param {typeof import('typescript')} ts
 * @param {import('typescript').SourceFile} file
 * @param {Record<string, any>} release
 * @returns {{ edits: { start: number, end: number, text: string }[], todos: { line: number, message: string }[] }} tokens, classes
 */
const stringRenames = (ts, file, release) => {
  const results = tsSource.nodesOf(ts, file, (node) => tsSource.isStringish(ts, node) && !isModuleName(ts, node)).map((node) => renameString(ts, file, node, release));
  return { edits: results.flatMap((result) => result.edits), todos: results.flatMap((result) => result.todos) };
};

export { stringRenames };
