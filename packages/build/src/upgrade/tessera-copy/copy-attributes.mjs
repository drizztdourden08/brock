/* @layer tooling-scripts @kind logic */
import { tesseraImports } from '../tessera/tessera-imports.mjs';
import { tesseraTags } from '../tessera/tessera-tags.mjs';
import { tsSource } from '../tessera/ts-source.mjs';

const hasAttribute = (ts, tag, name) =>
  tag.attributes.properties.some((attribute) => ts.isJsxAttribute(attribute) && attribute.name.getText() === name);

const tagEdits = (ts, attributes, { tag, component }) => {
  const missing = Object.entries(attributes[component]).filter(([name]) => !hasAttribute(ts, tag, name));
  if (missing.length === 0 || tag.typeArguments) return [];
  const at = tag.tagName.end;
  return [{ start: at, end: at, text: missing.map(([name, value]) => ` ${name}="${value}"`).join('') }];
};

/**
 * @param {typeof import('typescript')} ts
 * @param {{ path: string, source: string }} input a converted file, before the renames
 * @param {Record<string, Record<string, string>>} attributes from the copy map: props a component of the copy gains
 * @returns {string} with those props added where a tag lacks them
 */
const copyAttributes = (ts, { path, source }, attributes) => {
  const file = tsSource.parse(ts, path, source);
  const owners = new Map(tesseraImports(ts, file)
    .filter((entry) => !entry.reexport && Object.hasOwn(attributes, entry.imported))
    .map((entry) => [entry.local, entry.imported]));
  if (owners.size === 0) return source;
  return tsSource.applyEdits(source, tesseraTags(ts, file, owners).flatMap((found) => tagEdits(ts, attributes, found)));
};

export { copyAttributes };
