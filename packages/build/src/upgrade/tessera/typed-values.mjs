/* @layer tooling-scripts @kind logic */
import { literalRenames } from './literal-renames.mjs';
import { renameTodos } from './rename-todos.mjs';
import { tsSource } from './ts-source.mjs';
import { valueLiterals } from './value-literals.mjs';

const TYPE_WRAPPERS = ['UnionType', 'ArrayType', 'TypeOperator', 'ParenthesizedType'];

const typedValueOf = (ts, holder) => {
  if (ts.isAsExpression(holder) || ts.isSatisfiesExpression(holder) || ts.isTypeAssertionExpression(holder)) return holder.expression;
  return ts.isVariableDeclaration(holder) || ts.isParameter(holder) || ts.isPropertyDeclaration(holder) ? holder.initializer : undefined;
};

const holderOf = (ts, reference) => {
  let node = reference;
  while (TYPE_WRAPPERS.some((kind) => node.parent.kind === ts.SyntaxKind[kind])) node = node.parent;
  return node.parent.type === node ? node.parent : null;
};

const typedLiterals = (ts, file, local) =>
  tsSource.nodesOf(ts, file, (node) => ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName) && node.typeName.text === local)
    .map((reference) => holderOf(ts, reference))
    .filter(Boolean)
    .flatMap((holder) => valueLiterals(ts, typedValueOf(ts, holder)));

const looseTodos = (ts, file, { type, map, version, handled }) =>
  tsSource.nodesOf(ts, file, (node) => (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && Object.hasOwn(map, node.text) && !handled.has(node))
    .map((node) => ({
      line: tsSource.lineOf(file, node),
      message: `${renameTodos.releaseLabel(version)} renamed the ${type} value '${node.text}' to "${map[node.text]}". If this string is a ${type}, change it.`,
    }));

const typeRenames = (ts, file, imports, { type, map, version }) => {
  const entry = imports.find((item) => item.imported === type && !item.reexport);
  const literals = entry ? typedLiterals(ts, file, entry.local) : [];
  const renamed = literalRenames(file, literals, { map, kind: type, version });
  return { edits: renamed.edits, todos: [...renamed.todos, ...looseTodos(ts, file, { type, map, version, handled: new Set(literals) })] };
};

/**
 * @param {typeof import('typescript')} ts
 * @param {import('typescript').SourceFile} file
 * @param {ReturnType<typeof import('./tessera-imports.mjs').tesseraImports>} imports
 * @param {Record<string, any>} release
 * @returns {{ edits: { start: number, end: number, text: string }[], todos: { line: number, message: string }[] }} by type name
 */
const typedValues = (ts, file, imports, release) => {
  const results = Object.entries(release.propValues ?? {})
    .filter(([key]) => !key.includes('.'))
    .map(([type, map]) => typeRenames(ts, file, imports, { type, map: map ?? {}, version: release.version }));
  return { edits: results.flatMap((result) => result.edits), todos: results.flatMap((result) => result.todos) };
};

export { typedValues };
