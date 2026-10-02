/* @layer tooling-scripts @kind logic */

const PASS_THROUGH = ['ParenthesizedExpression', 'AsExpression', 'SatisfiesExpression', 'NonNullExpression', 'TypeAssertionExpression'];

const isPassThrough = (ts, node) => PASS_THROUGH.some((kind) => node.kind === ts.SyntaxKind[kind]);

const binaryBranches = (ts, node) => {
  const operator = node.operatorToken.kind;
  if (operator === ts.SyntaxKind.AmpersandAmpersandToken) return [node.right];
  const fallback = operator === ts.SyntaxKind.QuestionQuestionToken || operator === ts.SyntaxKind.BarBarToken;
  return fallback ? [node.left, node.right] : [];
};

const branchesOf = (ts, node) => {
  if (isPassThrough(ts, node)) return [node.expression];
  if (ts.isConditionalExpression(node)) return [node.whenTrue, node.whenFalse];
  if (ts.isBinaryExpression(node)) return binaryBranches(ts, node);
  if (ts.isArrayLiteralExpression(node)) return [...node.elements];
  return [];
};

/**
 * @param {typeof import('typescript')} ts
 * @param {import('typescript').Node} node
 * @returns {import('typescript').StringLiteralLike[]} the strings it can evaluate to
 */
const valueLiterals = (ts, node) => {
  if (!node) return [];
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return [node];
  return branchesOf(ts, node).flatMap((branch) => valueLiterals(ts, branch));
};

export { valueLiterals };
