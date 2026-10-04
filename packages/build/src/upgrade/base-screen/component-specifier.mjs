/* @layer tooling-scripts @kind logic */
import { posix } from 'node:path';
import { namedImport } from './named-import.mjs';

/**
 * @param {string} file root-relative path of the file that imports the component
 * @param {string} source
 * @param {string} component
 * @param {string} screensDir root-relative src/screens of the app
 * @returns {string | null} the import specifier of the component, seen from src/screens
 */
const componentSpecifier = (file, source, component, screensDir) => {
  const imported = namedImport(source, component);
  if (imported === null) return null;
  if (!imported.from.startsWith('.')) return imported.from;
  const relative = posix.relative(screensDir, posix.join(posix.dirname(file), imported.from));
  return relative.startsWith('.') ? relative : `./${relative}`;
};

export { componentSpecifier };
