/* @layer tooling-scripts @kind logic */

/**
 * @param {typeof import('typescript')} ts
 * @param {import('typescript').Node} node
 * @param {import('typescript').Node} child
 * @returns {boolean} true for a key name, never a reference
 */
const isKeyName = (ts, node, child) => {
  if (ts.isPropertyAccessExpression(node)) return child === node.name;
  if (ts.isPropertyAssignment(node) || ts.isMethodDeclaration(node) || ts.isPropertyDeclaration(node)) return child === node.name;
  if (ts.isGetAccessorDeclaration(node) || ts.isSetAccessorDeclaration(node) || ts.isEnumMember(node)) return child === node.name;
  if (ts.isBindingElement(node)) return child === node.propertyName;
  return ts.isJsxAttribute(node) && child === node.name;
};

/**
 * @param {typeof import('typescript')} ts
 * @param {import('typescript').Node} root
 * @returns {{ refs: Set<string>, jsx: boolean }} the names it reads at run time, and any JSX
 */
const runtimeRefs = (ts, root) => {
  const refs = new Set();
  let jsx = false;
  const visit = (node) => {
    if (ts.isIdentifier(node)) {
      refs.add(node.text);
      return;
    }
    if (ts.isExpressionWithTypeArguments(node)) {
      visit(node.expression);
      return;
    }
    if (ts.isTypeNode(node)) return;
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node) || ts.isJsxFragment(node)) jsx = true;
    ts.forEachChild(node, (child) => {
      if (!isKeyName(ts, node, child)) visit(child);
    });
  };
  visit(root);
  return { refs, jsx };
};

export { runtimeRefs };
