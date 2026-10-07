/* @layer tooling-scripts @kind logic */
import { renameTodos } from './rename-todos.mjs';
import { renameValue } from './rename-value.mjs';
import { tsSource } from './ts-source.mjs';
import { USAGE_KEYS } from './tessera-renames.constants.mjs';

const keyOf = (ts, property) => (ts.isPropertyAssignment(property) && (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) ? property.name.text : null);

const valueOf = (ts, object, key) => object.properties.find((property) => keyOf(ts, property) === key)?.initializer;

const isText = (ts, node) => node !== undefined && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node));

const isUsage = (ts, node) => ts.isObjectLiteralExpression(node) && valueOf(ts, node, USAGE_KEYS.alternatives) !== undefined && ts.isArrayLiteralExpression(valueOf(ts, node, USAGE_KEYS.alternatives));

const alternativeNames = (ts, usage) =>
  valueOf(ts, usage, USAGE_KEYS.alternatives).elements
    .filter((element) => ts.isObjectLiteralExpression(element))
    .map((element) => valueOf(ts, element, USAGE_KEYS.part))
    .filter((node) => isText(ts, node));

const nameEdit = (file, literal, { map, version }) => {
  const value = map[literal.text];
  if (renameValue.identifier(value)) return { edits: [{ start: literal.getStart(file) + 1, end: literal.end - 1, text: value }], todos: [] };
  return { edits: [], todos: [{ line: tsSource.lineOf(file, literal), message: renameTodos.note(version, 'component', { key: literal.text, value }) }] };
};

const escapeFor = (quote, text) => {
  const escaped = text.replace(/\\/g, '\\\\').replace(/\r/g, '\\r');
  if (quote === '`') return escaped.replace(/`|\$\{/g, (found) => `\\${found}`);
  return escaped.replaceAll(quote, `\\${quote}`).replace(/\n/g, '\\n');
};

const exampleEdit = (ts, file, literal, renameSnippet) => {
  const result = renameSnippet({ path: 'example.tsx', source: literal.text });
  const first = tsSource.lineOf(file, literal);
  const todos = result.todos.map((todo) => ({ ...todo, line: first + todo.line - 1 }));
  if (result.source === literal.text) return { edits: [], todos };
  const quote = file.text[literal.getStart(file)];
  return { edits: [{ start: literal.getStart(file) + 1, end: literal.end - 1, text: escapeFor(quote, result.source) }], todos };
};

/**
 * @param {typeof import('typescript')} ts
 * @param {import('typescript').SourceFile} file a usage file, <Name>.usage.ts
 * @param {Record<string, any>} release
 * @param {(snippet: { path: string, source: string }) => { source: string, todos: { line: number, message: string }[] }} renameSnippet the import renames and moves for code held in a string
 * @returns {{ edits: { start: number, end: number, text: string }[], todos: { line: number, message: string }[] }} the parts avoidWhen names, and the example code
 */
const usageRenames = (ts, file, release, renameSnippet) => {
  const rule = { map: release.components ?? {}, version: release.version };
  const results = tsSource.nodesOf(ts, file, (node) => isUsage(ts, node)).flatMap((usage) => {
    const names = alternativeNames(ts, usage).filter((literal) => Object.hasOwn(rule.map, literal.text)).map((literal) => nameEdit(file, literal, rule));
    const example = valueOf(ts, usage, USAGE_KEYS.example);
    return isText(ts, example) ? [...names, exampleEdit(ts, file, example, renameSnippet)] : names;
  });
  return { edits: results.flatMap((result) => result.edits), todos: results.flatMap((result) => result.todos) };
};

export { usageRenames };
