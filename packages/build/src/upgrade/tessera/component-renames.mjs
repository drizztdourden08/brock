/* @layer tooling-scripts @kind logic */
import { bindingReferences } from './binding-references.mjs';
import { renameTodos } from './rename-todos.mjs';
import { renameValue } from './rename-value.mjs';
import { tsSource } from './ts-source.mjs';

const lineEnd = (text, at) => {
  const newline = text.indexOf('\n', at);
  return newline === -1 ? text.length : newline + 1;
};

const removeSpecifier = (file, { specifier, declaration }) => {
  const list = specifier.parent.elements;
  const at = list.indexOf(specifier);
  if (list.length === 1) return { start: declaration.getStart(file), end: lineEnd(file.text, declaration.end), text: '' };
  if (at < list.length - 1) return { start: specifier.getStart(file), end: list[at + 1].getStart(file), text: '' };
  return { start: list[at - 1].end, end: specifier.end, text: '' };
};

const replaceNode = (file, node, text) => ({ start: node.getStart(file), end: node.end, text });

const referenceEdit = (ts, file, node, value) =>
  ts.isShorthandPropertyAssignment(node.parent) ? replaceNode(file, node, `${node.text}: ${value}`) : replaceNode(file, node, value);

const specifierEdit = (file, entry, value, taken) => {
  if (entry.specifier.propertyName) return replaceNode(file, entry.specifier.propertyName, value);
  return taken.has(value) && !entry.reexport ? removeSpecifier(file, entry) : replaceNode(file, entry.specifier.name, value);
};

const reexportTodo = (file, entry, value, version) => ({
  line: tsSource.lineOf(file, entry.specifier),
  message: `${renameTodos.releaseLabel(version)} renamed ${entry.imported} to ${value}, and this file re-exports it; the files that import ${entry.local} from here need ${value}.`,
});

const renameEntry = (ts, file, entry, { value, taken, version }) => {
  const edits = [specifierEdit(file, entry, value, taken)];
  const aliased = entry.specifier.propertyName !== undefined;
  if (!aliased && !entry.reexport) edits.push(...bindingReferences(ts, file, entry.local).map((node) => referenceEdit(ts, file, node, value)));
  taken.add(value);
  return { edits, todos: entry.reexport && !aliased ? [reexportTodo(file, entry, value, version)] : [] };
};

const isClosingTag = (ts, node) => ts.isJsxClosingElement(node.parent);

const noteEntry = (ts, file, entry, { version, value }) => {
  const nodes = [entry.specifier, ...(entry.reexport ? [] : bindingReferences(ts, file, entry.local).filter((node) => !isClosingTag(ts, node)))];
  const message = renameTodos.note(version, 'component', { key: entry.imported, value });
  return { edits: [], todos: nodes.map((node) => ({ line: tsSource.lineOf(file, node), message })) };
};

/**
 * @param {typeof import('typescript')} ts
 * @param {import('typescript').SourceFile} file
 * @param {ReturnType<typeof import('./tessera-imports.mjs').tesseraImports>} imports
 * @param {Record<string, any>} release
 * @returns {{ edits: { start: number, end: number, text: string }[], todos: { line: number, message: string }[] }}
 */
const componentRenames = (ts, file, imports, release) => {
  const map = release.components ?? {};
  const taken = new Set(imports.filter((entry) => !entry.reexport).map((entry) => entry.local));
  const results = imports
    .filter((entry) => Object.hasOwn(map, entry.imported))
    .map((entry) => {
      const value = map[entry.imported];
      if (!renameValue.identifier(value)) return noteEntry(ts, file, entry, { version: release.version, value });
      return renameEntry(ts, file, entry, { value, taken, version: release.version });
    });
  return { edits: results.flatMap((result) => result.edits), todos: results.flatMap((result) => result.todos) };
};

export { componentRenames };
