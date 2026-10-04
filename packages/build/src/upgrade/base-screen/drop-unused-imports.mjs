/* @layer tooling-scripts @kind logic */
import { NAMED_IMPORT } from './base-screen.constants.mjs';
import { localName } from './local-name.mjs';

const usedOutside = (body, name) => new RegExp(`(^|[^\\w$.])${name.replace(/\$/g, '\\$')}(?![\\w$])`).test(body);

/**
 * @param {string} source
 * @returns {string} without the named imports nothing refers to any more
 */
const dropUnusedImports = (source) => {
  const body = source.replace(NAMED_IMPORT, '');
  return source.replace(NAMED_IMPORT, (line, typeOnly, list, from) => {
    const kept = list.split(',').map((part) => part.trim()).filter((part) => part !== '' && usedOutside(body, localName(part)));
    if (kept.length === 0) return '';
    return `import ${typeOnly ?? ''}{ ${kept.join(', ')} } from '${from}';\n`;
  });
};

export { dropUnusedImports };
