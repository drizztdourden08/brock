/* @layer tooling-scripts @kind logic */
import { tesseraImports } from './tessera-imports.mjs';
import { tesseraTags } from './tessera-tags.mjs';
import { tesseraTypes } from './tessera-types.mjs';
import { tsSource } from './ts-source.mjs';

const REACT_RESERVED = new Set(['key']);

const attributeTodo = (ctx, file, { attribute, component, accepts }) => {
  const prop = attribute.name.getText(file);
  if (REACT_RESERVED.has(prop) || ctx.exact.has(`${component}.${prop}`)) return [];
  const rule = ctx.wildcards.ruleFor(component, prop);
  const taken = rule ? accepts(prop) : true;
  if (taken === true) return [];
  return [{ line: tsSource.lineOf(file, attribute), message: ctx.wildcards.todo({ rule, prop, sure: taken === false }) }];
};

const tagTodos = (ctx, file, { tag, component }) => {
  const accepts = tesseraTypes.propsAcceptor(ctx.checker, tag.attributes, ctx.wildcards.keep(component));
  return tag.attributes.properties
    .filter((attribute) => ctx.ts.isJsxAttribute(attribute))
    .flatMap((attribute) => attributeTodo(ctx, file, { attribute, component, accepts }));
};

/**
 * @param {{ ts: typeof import('typescript'), checker: import('typescript').TypeChecker, exact: Map<string, unknown>, wildcards: ReturnType<typeof import('./wildcard-props.mjs').wildcardProps> }} ctx exact: the props keys by Component.prop
 * @param {import('typescript').SourceFile} file a file of the checker program
 * @returns {{ line: number, message: string }[]} a to-do per attribute a wildcard key covers
 */
const typedAttributes = (ctx, file) => {
  const owners = new Map(tesseraImports(ctx.ts, file)
    .filter((entry) => !entry.reexport && ctx.wildcards.rules.has(entry.imported))
    .map((entry) => [entry.local, entry.imported]));
  return owners.size === 0 ? [] : tesseraTags(ctx.ts, file, owners).flatMap((found) => tagTodos(ctx, file, found));
};

export { typedAttributes };
