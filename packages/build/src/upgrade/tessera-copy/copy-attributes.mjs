/* @layer tooling-scripts @kind logic */
import { tesseraImports } from '../tessera/tessera-imports.mjs';
import { tesseraTags } from '../tessera/tessera-tags.mjs';
import { tsSource } from '../tessera/ts-source.mjs';
import { COPY_ATTRIBUTES } from './tessera-copy.constants.mjs';

const hasAttribute = (ts, tag, name) =>
  tag.attributes.properties.some((attribute) => ts.isJsxAttribute(attribute) && attribute.name.getText() === name);

const tagEdits = (ts, { tag, component }) => {
  const missing = Object.entries(COPY_ATTRIBUTES[component]).filter(([name]) => !hasAttribute(ts, tag, name));
  if (missing.length === 0 || tag.typeArguments) return [];
  const at = tag.tagName.end;
  return [{ start: at, end: at, text: missing.map(([name, value]) => ` ${name}="${value}"`).join('') }];
};

/**
 * @param {typeof import('typescript')} ts
 * @param {{ path: string, source: string }} input a converted file, before the renames
 * @returns {string} with the props COPY_ATTRIBUTES adds
 */
const copyAttributes = (ts, { path, source }) => {
  const file = tsSource.parse(ts, path, source);
  const owners = new Map(tesseraImports(ts, file)
    .filter((entry) => !entry.reexport && Object.hasOwn(COPY_ATTRIBUTES, entry.imported))
    .map((entry) => [entry.local, entry.imported]));
  if (owners.size === 0) return source;
  return tsSource.applyEdits(source, tesseraTags(ts, file, owners).flatMap((found) => tagEdits(ts, found)));
};

export { copyAttributes };
