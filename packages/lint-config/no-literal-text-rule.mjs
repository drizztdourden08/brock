/* @layer tooling-scripts @kind logic */
import {
  DEFAULT_ATTRIBUTES, DEFAULT_PROPERTIES, HAS_LETTER, LITERAL_TEXT_MESSAGE, MESSAGE_FUNCTION, PROPERTY_FILE, TEST_FILE, TEXT_PREVIEW_LENGTH,
} from './no-literal-text.constants.mjs';

const textOf = (node) => {
  if (!node) return null;
  if (node.type === 'Literal' && typeof node.value === 'string') return node.value;
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0) return node.quasis[0].value.cooked;
  return null;
};

const insideMessageCall = (node) => {
  for (let up = node.parent; up; up = up.parent) {
    if (up.type === 'CallExpression' && up.callee.type === 'Identifier' && up.callee.name === MESSAGE_FUNCTION) return true;
  }
  return false;
};

const propertyName = (node) => {
  if (node.computed) return null;
  if (node.key.type === 'Identifier') return node.key.name;
  return typeof node.key.value === 'string' ? node.key.value : null;
};

const preview = (text) => {
  const flat = text.trim().replace(/\s+/g, ' ');
  return flat.length > TEXT_PREVIEW_LENGTH ? `${flat.slice(0, TEXT_PREVIEW_LENGTH)}...` : flat;
};

const noLiteralText = {
  meta: {
    type: 'problem',
    docs: { description: 'User-visible text is a message ref from the locale table, never a string literal in JSX text, a text attribute or a label property' },
    schema: [{
      type: 'object',
      properties: {
        attributes: { type: 'array', items: { type: 'string' } },
        properties: { type: 'array', items: { type: 'string' } },
        ignore: { type: 'array', items: { type: 'string' } },
      },
      additionalProperties: false,
    }],
    messages: { literal: LITERAL_TEXT_MESSAGE },
  },
  create(context) {
    const options = context.options[0] ?? {};
    const attributes = new Set(options.attributes ?? DEFAULT_ATTRIBUTES);
    const properties = new Set(options.properties ?? DEFAULT_PROPERTIES);
    const ignored = (options.ignore ?? []).map((pattern) => new RegExp(pattern));
    const file = context.filename ?? context.getFilename();
    if (TEST_FILE.test(file)) return {};
    const checksProperties = new RegExp(PROPERTY_FILE).test(file);

    const check = (node, text) => {
      if (text === null || !HAS_LETTER.test(text) || ignored.some((pattern) => pattern.test(text.trim()))) return;
      if (insideMessageCall(node)) return;
      context.report({ node, messageId: 'literal', data: { text: preview(text) } });
    };

    const checkValue = (node) => {
      if (node?.type === 'ArrayExpression') node.elements.forEach((element) => check(element, textOf(element)));
      else check(node, textOf(node));
    };

    return {
      JSXText: (node) => check(node, node.value),
      JSXAttribute(node) {
        if (node.name.type !== 'JSXIdentifier' || !attributes.has(node.name.name) || !node.value) return;
        const value = node.value.type === 'JSXExpressionContainer' ? node.value.expression : node.value;
        check(value, textOf(value));
      },
      Property(node) {
        if (!checksProperties || node.parent.type !== 'ObjectExpression') return;
        const name = propertyName(node);
        if (name && properties.has(name)) checkValue(node.value);
      },
    };
  },
};

export { noLiteralText };
