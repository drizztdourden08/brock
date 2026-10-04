/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { constString } from './const-string.mjs';
import { namedImport } from './named-import.mjs';
import { resolveModule } from './resolve-module.mjs';

const literal = (expr) => /^(['"`])([^'"`$]*)\1$/.exec(expr)?.[2] ?? null;

/**
 * @param {string} rootDir
 * @param {string} file root-relative path of the source
 * @param {string} source
 * @param {string} expr a string literal or the name of a const
 * @returns {string | null} the string, following one import
 */
const resolveString = (rootDir, file, source, expr) => {
  const text = expr.trim();
  if (literal(text) !== null) return literal(text);
  if (!/^[A-Za-z_$][\w$]*$/.test(text)) return null;
  const local = constString(source, text);
  if (local !== null) return local;
  const imported = namedImport(source, text);
  const target = imported ? resolveModule(rootDir, file, imported.from) : null;
  return target ? constString(readFileSync(join(rootDir, target), 'utf8'), text) : null;
};

export { resolveString };
