/* @layer tooling-scripts @kind logic */
import { tsSource } from './ts-source.mjs';

const isTag = (ts, node) => ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node);

/**
 * @param {typeof import('typescript')} ts
 * @param {import('typescript').SourceFile} file
 * @param {Map<string, string>} owners local name to the imported Tessera name
 * @returns {{ tag: any, component: string }[]} the opening and self-closing tags
 */
const tesseraTags = (ts, file, owners) =>
  tsSource.nodesOf(ts, file, (node) => isTag(ts, node) && ts.isIdentifier(node.tagName) && owners.has(node.tagName.text))
    .map((tag) => ({ tag, component: owners.get(tag.tagName.text) }));

export { tesseraTags };
