/* @layer tooling-scripts @kind logic */
import { dirname } from 'node:path';
import { mergeImports } from '../design/merge-imports.mjs';
import { TESSERA_PACKAGE } from '../tessera/tessera-renames.constants.mjs';
import { tsSource } from '../tessera/ts-source.mjs';
import { copyTarget } from './copy-target.mjs';
import { TESSERA_MENTION } from './tessera-copy.constants.mjs';

const WHOLE_MODULE = Object.freeze({ namespace: 'A namespace import', default: 'A default import', all: 'An export *' });

const moduleNode = (ts, statement) => {
  const declaration = ts.isImportDeclaration(statement) || ts.isExportDeclaration(statement);
  const node = declaration ? statement.moduleSpecifier : undefined;
  return node && ts.isStringLiteral(node) ? node : null;
};

const shapeOf = (ts, statement) => {
  if (ts.isExportDeclaration(statement)) return statement.exportClause && ts.isNamedExports(statement.exportClause) ? 'named' : 'all';
  const clause = statement.importClause;
  if (!clause) return 'bare';
  if (clause.name) return 'default';
  return ts.isNamedImports(clause.namedBindings) ? 'named' : 'namespace';
};

const retarget = (file, node, module) => ({ start: node.getStart(file) + 1, end: node.end - 1, text: module });

const noteFor = (shape, { inner, stylesheet }) => {
  if (shape === 'named') return `${inner} in the copy has no Tessera entry point. Find the Tessera part that replaces it (Tessera's MIGRATION.md), or move the code into the app.`;
  if (shape === 'bare' && stylesheet) return `now imports Tessera's ${stylesheet} in place of the copy's ${inner}. Import the brand palette (palettes/<brand>.css) beside it, and keep what the copy's tokens held for this app alone (its own text styles and fonts) in the app theme.`;
  if (shape === 'bare') return `imports ${inner} of the copy for its side effect. Tessera parts bring their own styles: drop it, or move what the app keeps into its theme.`;
  return `${WHOLE_MODULE[shape]} of the copy (${inner}) is left alone: a part the copy and Tessera both name, such as Badge or Stepper, would point at Tessera's own part. Import the names it uses one by one, then run --tessera-from-copy again.`;
};

const changeOf = (ts, file, statement, place) => {
  const node = moduleNode(ts, statement);
  const target = node ? copyTarget(node.text, place) : null;
  if (target === null) return null;
  const shape = shapeOf(ts, statement);
  const line = tsSource.lineOf(file, statement);
  const module = shape === 'named' ? target.entry : (shape === 'bare' && target.stylesheet) || null;
  const todos = module && shape === 'named' ? [] : [{ line, message: noteFor(shape, target) }];
  return { node, line, module: module ? `${TESSERA_PACKAGE}/${module}` : null, todos };
};

const stringTodos = (ts, file, specifiers, place) =>
  tsSource.nodesOf(ts, file, (node) => (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && !specifiers.has(node))
    .map((node) => ({ node, target: copyTarget(node.text, place) }))
    .filter(({ target }) => target !== null && target.inner !== '')
    .map(({ node, target }) => ({
      line: tsSource.lineOf(file, node),
      message: `names ${target.inner} of the copy in a string, such as a dynamic import or a test mock. Point it at the Tessera entry by hand, after the parts it reaches are renamed.`,
    }));

const LEFT_ALONE = 'This file imports Tessera already, so its imports of the copy are left for a person: converting them would replay the renames over the Tessera parts it imports too.';

const blocked = (changes, strings) => [...new Set([...changes, ...strings].map(({ line }) => line))].map((line) => ({ line, message: LEFT_ALONE }));

/**
 * @param {typeof import('typescript')} ts
 * @param {{ path: string, source: string }} input path absolute
 * @param {{ copyDir: string, aliases: string[] }} copy
 * @returns {{ source: string, converted: boolean, todos: { line: number, message: string }[] }} named imports on Tessera
 */
const copyImports = (ts, { path, source }, { copyDir, aliases }) => {
  const place = { fileDir: dirname(path), copyDir, aliases };
  const file = tsSource.parse(ts, path, source);
  const changes = file.statements.map((statement) => changeOf(ts, file, statement, place)).filter((change) => change !== null);
  const strings = stringTodos(ts, file, new Set(changes.map(({ node }) => node)), place);
  if (TESSERA_MENTION.test(source)) return { source, converted: false, todos: blocked(changes, strings) };
  const moved = changes.filter(({ module }) => module !== null);
  const edited = tsSource.applyEdits(source, moved.map(({ node, module }) => retarget(file, node, module)));
  const merged = [...new Set(moved.map(({ module }) => module))].reduce(mergeImports, edited);
  return { source: merged, converted: moved.length > 0, todos: [...changes.flatMap(({ todos }) => todos), ...strings] };
};

export { copyImports };
