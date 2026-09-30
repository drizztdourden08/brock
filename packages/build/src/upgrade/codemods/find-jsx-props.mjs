/* @layer tooling-scripts @kind logic */
import { jsxAttributes } from './jsx-attributes.mjs';

const stringOf = (text) => /^(['"])((?:(?!\1).)*)\1$/s.exec(text)?.[2] ?? /^`([^`$]*)`$/.exec(text)?.[1] ?? null;

const literalOf = (value) => {
  if (value === null) return 'true';
  return stringOf(value.startsWith('{') ? value.slice(1, -1).trim() : value);
};

const lineOf = (source, index) => source.slice(0, index).split('\n').length;

/**
 * @param {string} source a .jsx or .tsx file
 * @param {string} element the component name, `BrockApp`
 * @param {string[]} names the props to find
 * @returns {{ name: string, start: number, end: number, line: number, literal: string | null }[]}
 */
const findJsxProps = (source, element, names) =>
  [...source.matchAll(new RegExp(`<${element}(?![\\w$.])`, 'g'))]
    .flatMap((match) => jsxAttributes(source, match.index + match[0].length))
    .filter((attribute) => names.includes(attribute.name))
    .map(({ name, start, end, value }) => ({ name, start, end, line: lineOf(source, start), literal: literalOf(value) }));

export { findJsxProps };
