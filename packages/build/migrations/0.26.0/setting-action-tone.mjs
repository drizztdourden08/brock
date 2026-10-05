/* @layer tooling-scripts @kind logic */
import { loadTypescript, tsSource } from '../../src/upgrade/index.mjs';

const BROCK_REACT = '@drizztdourden08/brock-react';

const WHY = 'Brock 0.26 names the look of a settings action tone, as Tessera\'s ActionData does since 0.21; variant still works as a deprecated alias until 0.27.';

const NO_TYPESCRIPT = `${WHY} TypeScript is not installed, so this file was not read: write tone in place of variant in each SettingAction.`;

const UNSURE = `${WHY} This object has label, onSelect and variant, but it is not in an actions list or typed SettingAction here: if it is a SettingAction, write tone in place of variant.`;

const BOTH = `${WHY} This settings action sets both tone and variant, and tone wins: remove variant.`;

const MAPPERS = new Set(['map', 'flatMap', 'filter', 'concat', 'slice', 'toSorted', 'toReversed']);

const PASS_THROUGH = ['ParenthesizedExpression', 'ArrayLiteralExpression', 'SpreadElement', 'ConditionalExpression', 'NonNullExpression', 'AsExpression', 'SatisfiesExpression'];

const MAX_CLIMB = 12;

const nameOf = (ts, node) => (node?.name && (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) ? node.name.text : null);

const membersOf = (ts, object) => new Map(object.properties.map((member) => [nameOf(ts, member), member]).filter(([name]) => name !== null));

const settingActionLocals = (ts, file) =>
  file.statements
    .filter((statement) => ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier) && statement.moduleSpecifier.text === BROCK_REACT)
    .flatMap((statement) => {
      const named = statement.importClause?.namedBindings;
      return named && ts.isNamedImports(named) ? [...named.elements] : [];
    })
    .filter((element) => (element.propertyName ?? element.name).text === 'SettingAction')
    .map((element) => element.name.text);

const escaped = (text) => text.replace(/\$/g, '\\$&');

const typedAction = (ctx, type) => type !== undefined && ctx.locals.some((local) => new RegExp(`(?<![\\w$])${escaped(local)}(?![\\w$])`).test(type.getText(ctx.file)));

const enclosingFunction = (ts, node) => {
  let at = node.parent;
  while (at && !ts.isFunctionLike(at)) at = at.parent;
  return at;
};

const mapperCall = (ts, fn) => {
  const call = fn.parent;
  const mapped = call && ts.isCallExpression(call) && call.arguments.includes(fn) && ts.isPropertyAccessExpression(call.expression) && MAPPERS.has(call.expression.name.text);
  return mapped ? call : null;
};

const isActionsHolder = (ctx, parent, node) => {
  const { ts } = ctx;
  if (ts.isPropertyAssignment(parent)) return parent.initializer === node && nameOf(ts, parent) === 'actions';
  return ts.isJsxExpression(parent) && ts.isJsxAttribute(parent.parent) && parent.parent.name.getText(ctx.file) === 'actions';
};

const functionOf = (ts, parent, node) => {
  if (ts.isReturnStatement(parent)) return enclosingFunction(ts, parent);
  return ts.isArrowFunction(parent) && parent.body === node ? parent : null;
};

const throughFunction = (ctx, fn, depth) => {
  if (typedAction(ctx, fn.type)) return 'typed';
  const call = mapperCall(ctx.ts, fn);
  return call ? holderKind(ctx, call, depth + 1) : null;
};

const isTypedHolder = (ctx, parent) => {
  const { ts } = ctx;
  const typed = ts.isAsExpression(parent) || ts.isSatisfiesExpression(parent) || ts.isVariableDeclaration(parent);
  return typed && typedAction(ctx, parent.type);
};

const holderKind = (ctx, node, depth = 0) => {
  const { ts } = ctx;
  const { parent } = node;
  if (!parent || depth > MAX_CLIMB) return null;
  if (ts.isPropertyAssignment(parent) || ts.isJsxExpression(parent)) return isActionsHolder(ctx, parent, node) ? 'list' : null;
  if (isTypedHolder(ctx, parent)) return 'typed';
  if (PASS_THROUGH.some((kind) => parent.kind === ts.SyntaxKind[kind])) return holderKind(ctx, parent, depth + 1);
  const fn = functionOf(ts, parent, node);
  return fn ? throughFunction(ctx, fn, depth) : null;
};

const renameEdit = (ts, file, member) => {
  if (ts.isShorthandPropertyAssignment(member)) return { start: member.name.getStart(file), end: member.name.end, text: 'tone: variant' };
  const start = member.name.getStart(file) + (ts.isStringLiteral(member.name) ? 1 : 0);
  return { start, end: start + 'variant'.length, text: 'tone' };
};

const NOTHING = Object.freeze({ edits: [], todos: [] });

const objectResult = (ctx, object) => {
  const { ts, file } = ctx;
  const members = membersOf(ts, object);
  const variant = members.get('variant');
  if (!variant || ts.isMethodDeclaration(variant)) return NOTHING;
  const looksLikeAction = members.has('label') && members.has('onSelect');
  const kind = holderKind(ctx, object);
  const action = kind === 'typed' || (kind === 'list' && looksLikeAction);
  if (!action) return looksLikeAction ? { edits: [], todos: [{ line: tsSource.lineOf(file, variant), message: UNSURE }] } : NOTHING;
  if (members.has('tone')) return { edits: [], todos: [{ line: tsSource.lineOf(file, variant), message: BOTH }] };
  return { edits: [renameEdit(ts, file, variant)], todos: [] };
};

const apply = ({ path, source }) => {
  if (!/\bvariant\b/.test(source)) return { source, todos: [] };
  const ts = loadTypescript(process.cwd());
  if (!ts) return { source, todos: /\bactions\s*[:=]/.test(source) ? [{ line: 1, message: NO_TYPESCRIPT }] : [] };
  const file = tsSource.parse(ts, path, source);
  const ctx = { ts, file, locals: settingActionLocals(ts, file) };
  const results = tsSource.nodesOf(ts, file, (node) => ts.isObjectLiteralExpression(node)).map((object) => objectResult(ctx, object));
  return { source: tsSource.applyEdits(source, results.flatMap((result) => result.edits)), todos: results.flatMap((result) => result.todos) };
};

const migration = Object.freeze({
  id: 'setting-action-tone',
  summary: 'Brock 0.26 renames SettingAction.variant to tone, matching Tessera\'s ActionData. variant becomes tone in the settings actions of actions lists and of objects typed SettingAction; variant still works until 0.27.',
  files: /(^|\/)src\/.+\.[jt]sx?$/,
  apply,
});

export { migration };
