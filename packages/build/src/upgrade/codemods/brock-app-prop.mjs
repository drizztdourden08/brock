/* @layer tooling-scripts @kind logic */
import { findJsxProps } from './find-jsx-props.mjs';
import { jsxAttributes } from './jsx-attributes.mjs';

const BROCK_IMPORT = /^import[^\n]*from '\.\.\/\.brock\/[^']+';[ \t]*$/gm;

const lastAttribute = (source) => {
  const tag = /<BrockApp(?![\w$.])/.exec(source);
  return tag ? jsxAttributes(source, tag.index + tag[0].length).at(-1) ?? null : null;
};

/**
 * @param {string} source  src/main.tsx
 * @param {{ prop: string, name: string, from: string }} wiring  The prop, the export and its .brock module
 * @returns {string}  The source with the prop and its import
 */
const withBrockAppProp = (source, { prop, name, from }) => {
  const brockImports = [...source.matchAll(BROCK_IMPORT)];
  const attribute = lastAttribute(source);
  const wired = source.includes(`'${from}'`) || findJsxProps(source, 'BrockApp', [prop]).length > 0;
  if (wired || brockImports.length === 0 || !attribute) return source;
  const lineStart = source.lastIndexOf('\n', attribute.start) + 1;
  const indent = /^[ \t]*/.exec(source.slice(lineStart))?.[0] ?? '';
  const ownLine = source.slice(lineStart, attribute.start).trim() === '';
  const added = ownLine ? `\n${indent}${prop}={${name}}` : ` ${prop}={${name}}`;
  const withProp = `${source.slice(0, attribute.end)}${added}${source.slice(attribute.end)}`;
  const lastImport = brockImports.at(-1);
  const at = lastImport.index + lastImport[0].length;
  return `${withProp.slice(0, at)}\nimport { ${name} } from '${from}';${withProp.slice(at)}`;
};

export { withBrockAppProp };
