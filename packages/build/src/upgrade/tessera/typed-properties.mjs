/* @layer tooling-scripts @kind logic */
import { checkerProgram } from './checker-program.mjs';
import { propertyRules } from './property-rules.mjs';
import { renameTodos } from './rename-todos.mjs';
import { tesseraOwned } from './tessera-owned.mjs';
import { IDENTIFIER, SCRIPT_FILE } from './tessera-renames.constants.mjs';
import { tsSource } from './ts-source.mjs';

const escaped = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const memberName = (ts, member) => (member.name && (ts.isIdentifier(member.name) || ts.isStringLiteral(member.name)) ? member.name.text : null);

const targetedObjects = (ts, file, rules) =>
  tsSource.nodesOf(ts, file, (node) => ts.isObjectLiteralExpression(node) && node.properties.some((member) => rules.has(memberName(ts, member))));

const constituents = (type) => (type.isUnionOrIntersection() ? type.types.flatMap(constituents) : [type]);

const fromTessera = (symbol) => symbol?.declarations?.some((declaration) => tesseraOwned(declaration.getSourceFile().fileName)) === true;

const ownerNames = (type) =>
  new Set(constituents(type).flatMap((part) => [part.aliasSymbol, part.getSymbol()]).filter(fromTessera).map((symbol) => symbol.getName()));

const declaredType = (checker, object) => checker.getContextualType(object) ?? checker.getTypeAtLocation(object);

const nameText = (ts, member, to) => {
  if (ts.isShorthandPropertyAssignment(member)) return `${to}: ${member.name.text}`;
  return IDENTIFIER.test(to) || ts.isStringLiteral(member.name) ? to : `'${to}'`;
};

const nameSpan = (ts, file, name) =>
  (ts.isStringLiteral(name) ? { start: name.getStart(file) + 1, end: name.end - 1 } : { start: name.getStart(file), end: name.end });

const memberResult = (ts, file, member, { rule, version }) => {
  if (!rule.rename) return { edits: [], todos: [{ line: tsSource.lineOf(file, member), message: renameTodos.note(version, 'prop', rule) }] };
  return { edits: [{ ...nameSpan(ts, file, member.name), text: nameText(ts, member, rule.rename) }], todos: [] };
};

const objectResults = (ctx, file, object) => {
  const { ts, checker, rules, version } = ctx;
  const owners = ownerNames(declaredType(checker, object));
  if (owners.size === 0) return [];
  return object.properties.flatMap((member) => {
    const rule = (rules.get(memberName(ts, member)) ?? []).find((candidate) => owners.has(candidate.owner));
    return rule ? [memberResult(ts, file, member, { rule, version })] : [];
  });
};

const fileResult = (ctx, file) => {
  const results = targetedObjects(ctx.ts, file, ctx.rules).flatMap((object) => objectResults(ctx, file, object));
  return { edits: results.flatMap((result) => result.edits), todos: results.flatMap((result) => result.todos) };
};

const candidatesOf = (ts, sources, rules) => {
  const mentions = new RegExp(`(?:^|[^\\w$-])(?:${[...rules.keys()].map(escaped).join('|')})(?![\\w$-])`);
  return sources.filter(({ path, source }) => SCRIPT_FILE.test(path) && mentions.test(source) && targetedObjects(ts, tsSource.parse(ts, path, source), rules).length > 0);
};

/**
 * @param {typeof import('typescript')} ts
 * @param {{ file: string, path: string, source: string }[]} sources the app's files, file absolute
 * @param {Record<string, any>} release one RENAMES.json release
 * @returns {Map<string, { edits: { start: number, end: number, text: string }[], todos: { line: number, message: string }[] }>} by path, for literals typed as a props key's owner
 */
const typedProperties = (ts, sources, release) => {
  const rules = propertyRules(release);
  const candidates = rules.size > 0 ? candidatesOf(ts, sources, rules) : [];
  if (candidates.length === 0) return new Map();
  const program = checkerProgram(ts, new Map(candidates.map(({ file, source }) => [file, source])));
  const ctx = { ts, checker: program.getTypeChecker(), rules, version: release.version };
  return new Map(candidates.map(({ file, path }) => [path, fileResult(ctx, program.getSourceFile(file))]));
};

export { typedProperties };
