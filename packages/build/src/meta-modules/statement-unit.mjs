/* @layer tooling-scripts @kind logic */
import { runtimeRefs } from './runtime-refs.mjs';

/**
 * @typedef {{ local: string, text: string }} ImportPart
 * @typedef {{ default?: ImportPart, namespace?: ImportPart, named: ImportPart[] }} ImportParts
 * @typedef {'import' | 'export' | 'code' | 'dropped'} UnitKind
 * @typedef {{ kind: UnitKind, declares: string[], refs: Set<string>, jsx: boolean, exports: string[], parts?: ImportParts, from?: string, text: string }} Unit
 */

const NONE = { refs: new Set(), jsx: false };

/** @param {typeof import('typescript')} ts @param {import('typescript').Node} node */
const hasModifier = (ts, node, kind) => (ts.canHaveModifiers(node) ? ts.getModifiers(node) ?? [] : []).some((modifier) => modifier.kind === kind);

/** @param {typeof import('typescript')} ts @param {import('typescript').BindingName} name @returns {string[]} */
const bindingNames = (ts, name) => {
  if (ts.isIdentifier(name)) return [name.text];
  return name.elements.flatMap((element) => (ts.isOmittedExpression(element) ? [] : bindingNames(ts, element.name)));
};

/** @param {string[]} declares @param {Partial<Unit>} rest @returns {Unit} */
const unit = (declares, rest) => ({ kind: 'code', declares, refs: NONE.refs, jsx: false, exports: [], text: '', ...rest });

/** @param {typeof import('typescript')} ts @param {import('typescript').ImportDeclaration} node @returns {Unit} */
const importUnit = (ts, node) => {
  const clause = node.importClause;
  if (!clause || clause.isTypeOnly) return unit([], { kind: 'dropped' });
  const parts = { named: [] };
  if (clause.name) parts.default = { local: clause.name.text, text: clause.name.text };
  const bindings = clause.namedBindings;
  if (bindings && ts.isNamespaceImport(bindings)) parts.namespace = { local: bindings.name.text, text: `* as ${bindings.name.text}` };
  if (bindings && ts.isNamedImports(bindings)) {
    parts.named = bindings.elements.filter((element) => !element.isTypeOnly).map((element) => ({ local: element.name.text, text: element.getText().trim() }));
  }
  const declares = [parts.default, parts.namespace, ...parts.named].filter(Boolean).map((part) => part.local);
  return unit(declares, { kind: 'import', parts, from: node.moduleSpecifier.getText() });
};

/** @param {import('typescript').ExportDeclaration} node @param {readonly string[]} wanted @returns {Unit} */
const exportListUnit = (node, wanted) => {
  const clause = node.exportClause;
  if (node.isTypeOnly || !clause || !('elements' in clause)) return unit([], { kind: 'dropped' });
  const kept = clause.elements.filter((element) => !element.isTypeOnly && wanted.includes(element.name.text));
  const refs = node.moduleSpecifier ? new Set() : new Set(kept.map((element) => (element.propertyName ?? element.name).text));
  const from = node.moduleSpecifier ? ` from ${node.moduleSpecifier.getText()}` : '';
  const text = kept.length ? `export { ${kept.map((element) => element.getText().trim()).join(', ')} }${from};` : '';
  return unit([], { kind: 'export', refs, exports: kept.map((element) => element.name.text), text });
};

/** @param {typeof import('typescript')} ts @param {import('typescript').Statement} node @param {string[]} declares @param {readonly string[]} wanted @returns {Unit} */
const declarationUnit = (ts, node, declares, wanted) => {
  if (hasModifier(ts, node, ts.SyntaxKind.DeclareKeyword)) return unit([], { kind: 'dropped' });
  if (hasModifier(ts, node, ts.SyntaxKind.DefaultKeyword)) return unit(declares, { kind: 'dropped' });
  const exported = hasModifier(ts, node, ts.SyntaxKind.ExportKeyword);
  const { refs, jsx } = runtimeRefs(ts, node);
  for (const name of declares) refs.delete(name);
  return unit(declares, { refs, jsx, exports: exported ? declares.filter((name) => wanted.includes(name)) : [], text: node.getText() });
};

/** @param {typeof import('typescript')} ts @param {import('typescript').Statement} node @returns {string | null} */
const declaredName = (ts, node) => {
  const named = ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node) || ts.isEnumDeclaration(node) || ts.isModuleDeclaration(node);
  return named && node.name && ts.isIdentifier(node.name) ? node.name.text : null;
};

/**
 * @param {typeof import('typescript')} ts
 * @param {import('typescript').Statement} node one top-level statement
 * @param {readonly string[]} wanted the export names the meta module keeps
 * @returns {Unit}
 */
const statementUnit = (ts, node, wanted) => {
  if (ts.isImportDeclaration(node)) return importUnit(ts, node);
  if (ts.isExportDeclaration(node)) return exportListUnit(node, wanted);
  if (ts.isVariableStatement(node)) return declarationUnit(ts, node, node.declarationList.declarations.flatMap((item) => bindingNames(ts, item.name)), wanted);
  const name = declaredName(ts, node);
  if (name !== null) return declarationUnit(ts, node, [name], wanted);
  return unit(ts.isImportEqualsDeclaration(node) ? [node.name.text] : [], { kind: 'dropped' });
};

export { statementUnit };
