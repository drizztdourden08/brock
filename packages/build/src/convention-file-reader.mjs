/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { literalFields } from './screens/literal/literal-fields.mjs';
import { readDefinedDefault } from './screens/literal/read-defined-default.mjs';
import { DEFAULT_EXPORT } from './widgets/widget-conventions.constants.mjs';

/** @typedef {{ dir: string, suffix: string, idPattern: RegExp, constantsFile: RegExp, noun: string, fileHint: string, folderHint: string, define: string, shell: Record<string, 'string' | 'literal'>, required: readonly string[], extra?: (source: string) => Record<string, unknown> }} ConventionKind */

/**
 * @param {ConventionKind} kind
 * @returns {(rootDir: string, entry: import('node:fs').Dirent) => { file?: { id: string, path: string, hasDefault: boolean, shell: Record<string, unknown> | null } & Record<string, unknown>, finding?: string }}
 */
const conventionReader = (kind) => (rootDir, entry) => {
  const path = `${kind.dir}/${entry.name}`;
  if (entry.isDirectory()) return { finding: `${path}: ${kind.folderHint}` };
  if (kind.constantsFile.test(entry.name)) return {};
  if (!entry.name.endsWith(kind.suffix)) return { finding: `${path}: not a ${kind.noun} file; ${kind.fileHint}` };
  const id = entry.name.slice(0, -kind.suffix.length);
  if (!kind.idPattern.test(id)) return { finding: `${path}: "${id}" is not a kebab-case id` };
  const source = readFileSync(join(rootDir, path), 'utf8');
  const shell = literalFields(readDefinedDefault(source, kind.define), kind.shell, kind.required);
  return { file: { id, path, hasDefault: DEFAULT_EXPORT.test(source), shell, ...kind.extra?.(source) } };
};

export { conventionReader };
