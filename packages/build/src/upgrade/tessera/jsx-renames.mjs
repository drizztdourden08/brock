/* @layer tooling-scripts @kind logic */
import { literalRenames } from './literal-renames.mjs';
import { propRules } from './prop-rules.mjs';
import { renameTodos } from './rename-todos.mjs';
import { tsSource } from './ts-source.mjs';
import { valueLiterals } from './value-literals.mjs';

const valueRules = (release, props) => {
  const rules = new Map(Object.entries(release.propValues ?? {}).filter(([key]) => key.includes('.')));
  for (const [path, map] of [...rules]) {
    const rename = props.get(path)?.rename;
    if (rename) rules.set(`${path.split('.')[0]}.${rename}`, map);
  }
  return rules;
};

const isTag = (ts, node) => ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node);

const tagsOf = (ts, file, owners) =>
  tsSource.nodesOf(ts, file, (node) => isTag(ts, node) && ts.isIdentifier(node.tagName) && owners.has(node.tagName.text))
    .map((tag) => ({ tag, component: owners.get(tag.tagName.text) }));

const attributesOf = (ts, tag) => tag.attributes.properties.filter((attribute) => ts.isJsxAttribute(attribute));

const literalsOf = (ts, initializer) => {
  if (!initializer) return [];
  return ts.isJsxExpression(initializer) ? valueLiterals(ts, initializer.expression) : valueLiterals(ts, initializer);
};

const propEdit = (file, attribute, rule, version) => {
  if (rule.rename) return { edits: [{ start: attribute.name.getStart(file), end: attribute.name.end, text: rule.rename }], todos: [] };
  return { edits: [], todos: [{ line: tsSource.lineOf(file, attribute), message: renameTodos.note(version, 'prop', rule) }] };
};

const indirectTodo = (file, attribute, { path, values, version }) => {
  const pairs = Object.entries(values).map(([from, to]) => `'${from}' -> '${to}'`).join(', ');
  return { edits: [], todos: [{ line: tsSource.lineOf(file, attribute), message: `${renameTodos.releaseLabel(version)} renamed values of ${path} (${pairs}); this one is not a literal, and the file holds an old value. Check where it comes from.` }] };
};

const stringTexts = (ts, file) => new Set(tsSource.nodesOf(ts, file, (node) => ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)).map((node) => node.text));

const attributeRenames = (ts, file, { path, attribute }, rules) => {
  const results = [];
  const prop = rules.props.get(path);
  if (prop) results.push(propEdit(file, attribute, prop, rules.version));
  const values = rules.values.get(path);
  if (!values) return results;
  const literals = literalsOf(ts, attribute.initializer);
  results.push(literalRenames(file, literals, { map: values, kind: path, version: rules.version }));
  if (literals.length === 0 && attribute.initializer && Object.keys(values).some((old) => rules.literals.has(old))) results.push(indirectTodo(file, attribute, { path, values, version: rules.version }));
  return results;
};

/**
 * @param {typeof import('typescript')} ts
 * @param {import('typescript').SourceFile} file
 * @param {ReturnType<typeof import('./tessera-imports.mjs').tesseraImports>} imports
 * @param {Record<string, any>} release
 * @returns {{ edits: { start: number, end: number, text: string }[], todos: { line: number, message: string }[] }} props, prop values
 */
const jsxRenames = (ts, file, imports, release) => {
  const props = propRules(release);
  const rules = { props, values: valueRules(release, props), version: release.version, literals: stringTexts(ts, file) };
  const owners = new Map(imports.filter((entry) => !entry.reexport).map((entry) => [entry.local, entry.imported]));
  const results = tagsOf(ts, file, owners).flatMap(({ tag, component }) =>
    attributesOf(ts, tag).flatMap((attribute) => attributeRenames(ts, file, { path: `${component}.${attribute.name.getText(file)}`, attribute }, rules)));
  return { edits: results.flatMap((result) => result.edits), todos: results.flatMap((result) => result.todos) };
};

export { jsxRenames };
