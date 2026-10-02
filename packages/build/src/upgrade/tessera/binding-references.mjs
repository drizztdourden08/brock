/* @layer tooling-scripts @kind logic */
import { tsSource } from './ts-source.mjs';

const isLocalExport = (ts, node) => {
  const { parent } = node;
  return !parent.parent.parent.moduleSpecifier && (parent.propertyName ?? parent.name) === node;
};

const isReference = (ts, node) => {
  const { parent } = node;
  if (ts.isExportSpecifier(parent)) return isLocalExport(ts, node);
  if (ts.isImportSpecifier(parent) || ts.isImportClause(parent) || ts.isNamespaceImport(parent)) return false;
  if (ts.isShorthandPropertyAssignment(parent)) return true;
  if (ts.isQualifiedName(parent)) return parent.left === node;
  if (ts.isBindingElement(parent)) return parent.initializer === node;
  return parent.name !== node;
};

/**
 * @param {typeof import('typescript')} ts
 * @param {import('typescript').SourceFile} file
 * @param {string} local an imported binding
 * @returns {import('typescript').Identifier[]} its JSX tags, type references and values
 */
const bindingReferences = (ts, file, local) =>
  tsSource.nodesOf(ts, file, (node) => ts.isIdentifier(node) && node.text === local && isReference(ts, node));

export { bindingReferences };
