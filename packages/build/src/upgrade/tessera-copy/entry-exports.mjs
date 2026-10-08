/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { TESSERA_ENTRIES } from './tessera-copy.constants.mjs';

const fileOf = (target) => (typeof target === 'string' ? target : target?.types ?? target?.default ?? null);

const entryFiles = (tesseraDir) => {
  const { exports: map = {} } = JSON.parse(readFileSync(join(tesseraDir, 'package.json'), 'utf8'));
  return TESSERA_ENTRIES.map((entry) => ({ entry, target: fileOf(map[`./${entry}`]) }))
    .filter(({ target }) => typeof target === 'string' && /\.m?tsx?$/.test(target))
    .map(({ entry, target }) => ({ entry, file: resolve(tesseraDir, target) }))
    .filter(({ file }) => existsSync(file));
};

const optionsOf = (ts) => ({
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  allowImportingTsExtensions: true,
  noEmit: true,
  skipLibCheck: true,
  noLib: true,
  types: [],
});

/**
 * @param {typeof import('typescript')} ts
 * @param {string} tesseraDir the installed package
 * @returns {Map<string, Set<string>>} exported names by entry subpath
 */
const entryExports = (ts, tesseraDir) => {
  const entries = entryFiles(tesseraDir);
  const program = ts.createProgram({ rootNames: entries.map(({ file }) => file), options: optionsOf(ts) });
  const checker = program.getTypeChecker();
  return new Map(entries.map(({ entry, file }) => {
    const source = program.getSourceFile(file);
    const symbol = source ? checker.getSymbolAtLocation(source) : undefined;
    return [entry, new Set(symbol ? checker.getExportsOfModule(symbol).map((exported) => exported.getName()) : [])];
  }));
};

export { entryExports };
