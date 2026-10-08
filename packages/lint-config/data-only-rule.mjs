/* @layer tooling-scripts @kind logic */
import { DATA_HEADER, DATA_ONLY_MESSAGE, NUMBER_OPERATORS, UNARY_OPERATORS } from './data-kind.constants.mjs';

const TYPE_WRAPPERS = ['TSAsExpression', 'TSSatisfiesExpression', 'TSTypeAssertion'];
const DECLARATIONS = ['ImportDeclaration', 'TSTypeAliasDeclaration', 'TSInterfaceDeclaration', 'TSEnumDeclaration', 'ExportAllDeclaration', 'EmptyStatement'];

const isFreeze = (node) => node.callee.type === 'MemberExpression' && !node.callee.computed
  && node.callee.object.type === 'Identifier' && node.callee.object.name === 'Object' && node.callee.property.name === 'freeze'
  && node.arguments.length === 1;

const offender = (node) => {
  if (!node) return null;
  const check = SHAPES[node.type];
  return check ? check(node) : node;
};

const firstOf = (nodes) => nodes.map(offender).find(Boolean) ?? null;

const property = (node) => {
  if (node.type === 'SpreadElement') return offender(node.argument);
  if (node.kind !== 'init' || node.method) return node;
  return firstOf([...(node.computed ? [node.key] : []), node.value]);
};

const SHAPES = {
  Literal: () => null,
  Identifier: () => null,
  TemplateLiteral: (node) => firstOf(node.expressions),
  MemberExpression: (node) => firstOf([node.object, ...(node.computed ? [node.property] : [])]),
  ArrayExpression: (node) => firstOf(node.elements.filter(Boolean).map((element) => (element.type === 'SpreadElement' ? element.argument : element))),
  ObjectExpression: (node) => node.properties.map(property).find(Boolean) ?? null,
  UnaryExpression: (node) => (UNARY_OPERATORS.includes(node.operator) ? offender(node.argument) : node),
  BinaryExpression: (node) => (NUMBER_OPERATORS.includes(node.operator) ? firstOf([node.left, node.right]) : node),
  CallExpression: (node) => (isFreeze(node) ? offender(node.arguments[0]) : node),
  ...Object.fromEntries(TYPE_WRAPPERS.map((type) => [type, (node) => offender(node.expression)])),
};

const declarationOffender = (node) => {
  if (node.kind !== 'const') return node;
  return node.declarations.map((declarator) => (declarator.id.type === 'Identifier' ? offender(declarator.init) : declarator)).find(Boolean) ?? null;
};

const statementOffender = (node) => {
  if (DECLARATIONS.includes(node.type)) return null;
  if (node.type === 'VariableDeclaration') return declarationOffender(node);
  if (node.type === 'ExportNamedDeclaration') return node.declaration ? statementOffender(node.declaration) : null;
  if (node.type === 'ExportDefaultDeclaration') return offender(node.declaration);
  return node;
};

const words = (type) => type.replace(/^TS/, '').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();

const dataOnly = {
  meta: {
    type: 'problem',
    docs: { description: 'A file whose header says @kind data holds data only, so the size and one-export exemptions of the kind cover no logic' },
    schema: [],
    messages: { logic: DATA_ONLY_MESSAGE },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return {
      Program(program) {
        const header = sourceCode.getAllComments().find((comment) => comment.type !== 'Shebang');
        if (!header || !DATA_HEADER.test(header.value)) return;
        for (const statement of program.body) {
          const found = statementOffender(statement);
          if (found) context.report({ node: found, messageId: 'logic', data: { what: words(found.type) } });
        }
      },
    };
  },
};

export { dataOnly };
