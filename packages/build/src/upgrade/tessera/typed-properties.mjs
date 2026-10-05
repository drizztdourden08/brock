/* @layer tooling-scripts @kind logic */
import { checkerProgram } from './checker-program.mjs';
import { propRules } from './prop-rules.mjs';
import { propertyRules } from './property-rules.mjs';
import { renameTodos } from './rename-todos.mjs';
import { IDENTIFIER, SCRIPT_FILE } from './tessera-renames.constants.mjs';
import { tesseraTypes } from './tessera-types.mjs';
import { tsSource } from './ts-source.mjs';
import { typedAttributes } from './typed-attributes.mjs';
import { wildcardProps } from './wildcard-props.mjs';

const escaped = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const alternation = (names) => (names.length > 0 ? names.map(escaped).join('|') : '(?!)');

const memberName = (ts, member) => (member.name && (ts.isIdentifier(member.name) || ts.isStringLiteral(member.name)) ? member.name.text : null);

const nameText = (ts, member, to) => {
  if (ts.isShorthandPropertyAssignment(member)) return `${to}: ${member.name.text}`;
  return IDENTIFIER.test(to) || ts.isStringLiteral(member.name) ? to : `'${to}'`;
};

const nameSpan = (ts, file, name) =>
  (ts.isStringLiteral(name) ? { start: name.getStart(file) + 1, end: name.end - 1 } : { start: name.getStart(file), end: name.end });

const todoAt = (file, member, message) => ({ edits: [], todos: [{ line: tsSource.lineOf(file, member), message }] });

const exactResult = (ts, file, member, { rule, version }) => {
  if (!rule.rename) return todoAt(file, member, renameTodos.note(version, 'prop', rule));
  return { edits: [{ ...nameSpan(ts, file, member.name), text: nameText(ts, member, rule.rename) }], todos: [] };
};

const wildcardResult = (ctx, file, member, { owners, type, prop }) => {
  const rule = [...ctx.wildcards.rules.keys()]
    .filter((owner) => tesseraTypes.owns(owners, owner))
    .map((owner) => ctx.wildcards.ruleFor(owner, prop))
    .find(Boolean);
  if (!rule || tesseraTypes.takes(ctx.checker, type, prop)) return [];
  return [todoAt(file, member, ctx.wildcards.todo({ rule, prop, sure: true }))];
};

const memberResults = (ctx, file, member, found) => {
  const prop = memberName(ctx.ts, member);
  if (prop === null) return [];
  const rule = (ctx.rules.get(prop) ?? []).find((candidate) => tesseraTypes.owns(found.owners, candidate.owner));
  return rule ? [exactResult(ctx.ts, file, member, { rule, version: ctx.version })] : wildcardResult(ctx, file, member, { ...found, prop });
};

const objectResults = (ctx, file, object) => {
  const type = tesseraTypes.declaredType(ctx.checker, object);
  const owners = tesseraTypes.ownerNames(type);
  return owners.size === 0 ? [] : object.properties.flatMap((member) => memberResults(ctx, file, member, { owners, type }));
};

const searchOf = (rules, wildcards) => ({
  props: new RegExp(`(?:^|[^\\w$-])(?:${alternation([...rules.keys()])})(?![\\w$-])`),
  owners: new RegExp(`(?:^|[^\\w$])(?:${alternation([...wildcards.rules.keys()])})`),
});

const targetedObjects = (ts, file, { rules, search }) => {
  const anyMember = search.owners.test(file.text);
  return tsSource.nodesOf(ts, file, (node) => ts.isObjectLiteralExpression(node) && node.properties.some((member) => anyMember || rules.has(memberName(ts, member))));
};

const fileResult = (ctx, file) => {
  const results = targetedObjects(ctx.ts, file, ctx).flatMap((object) => objectResults(ctx, file, object));
  return { edits: results.flatMap((result) => result.edits), todos: [...results.flatMap((result) => result.todos), ...typedAttributes(ctx, file)] };
};

const isCandidate = (ts, { path, source }, found) => {
  if (!SCRIPT_FILE.test(path)) return false;
  if (found.search.owners.test(source)) return true;
  return found.search.props.test(source) && targetedObjects(ts, tsSource.parse(ts, path, source), found).length > 0;
};

/**
 * @param {typeof import('typescript')} ts
 * @param {{ file: string, path: string, source: string }[]} sources the app's files, file absolute
 * @param {Record<string, any>} release one RENAMES.json release
 * @returns {Map<string, { edits: { start: number, end: number, text: string }[], todos: { line: number, message: string }[] }>} by path, typed literals and wildcard attributes
 */
const typedProperties = (ts, sources, release) => {
  const rules = propertyRules(release);
  const wildcards = wildcardProps(release);
  const found = { rules, wildcards, search: searchOf(rules, wildcards) };
  const candidates = rules.size > 0 || wildcards.rules.size > 0 ? sources.filter((item) => isCandidate(ts, item, found)) : [];
  if (candidates.length === 0) return new Map();
  const program = checkerProgram(ts, new Map(candidates.map(({ file, source }) => [file, source])));
  const ctx = { ...found, ts, checker: program.getTypeChecker(), exact: propRules(release), version: release.version };
  return new Map(candidates.map(({ file, path }) => [path, fileResult(ctx, program.getSourceFile(file))]));
};

export { typedProperties };
