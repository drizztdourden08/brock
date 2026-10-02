/* @layer tooling-scripts @kind logic */
import { dirname, resolve } from 'node:path';
import { APP_ALIAS, IMPORT_FROM_BEFORE, PATH_REFERENCE } from './design.constants.mjs';

const lineAt = (source, index) => source.slice(0, index).split('\n').length;

const targetOf = (file, spec, appSrc) => {
  if (!spec.startsWith(APP_ALIAS)) return resolve(dirname(file), spec);
  return appSrc ? resolve(appSrc, spec.slice(APP_ALIAS.length)) : null;
};

/**
 * @param {string} file  absolute
 * @param {string} source
 * @param {string | null} appSrc  the folder @app/ stands for
 * @returns {{ file: string, spec: string, target: string, line: number, start: number, end: number, fromImport: boolean }[]} relative and @app/ paths
 */
const fileReferences = (file, source, appSrc) => [...source.matchAll(PATH_REFERENCE)].flatMap((match) => {
  const target = targetOf(file, match[2], appSrc);
  if (!target) return [];
  const start = match.index + 1;
  return [{
    file,
    spec: match[2],
    target,
    line: lineAt(source, match.index),
    start,
    end: start + match[2].length,
    fromImport: IMPORT_FROM_BEFORE.test(source.slice(Math.max(0, match.index - 12), match.index)),
  }];
});

export { fileReferences };
