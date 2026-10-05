/* @layer tooling-scripts @kind logic */
import { resolve } from 'node:path';

const parsed = new Map();

const optionsOf = (ts) => ({
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  allowJs: true,
  checkJs: false,
  skipLibCheck: true,
  noEmit: true,
  strict: true,
  allowImportingTsExtensions: true,
  resolveJsonModule: true,
  types: [],
});

const sharedFile = (ts, fileName, languageVersion) => {
  const text = ts.sys.readFile(fileName);
  if (text === undefined) return undefined;
  const cached = parsed.get(fileName);
  if (cached?.text === text) return cached.file;
  const file = ts.createSourceFile(fileName, text, languageVersion, true);
  parsed.set(fileName, { text, file });
  return file;
};

/**
 * @param {typeof import('typescript')} ts
 * @param {Map<string, string>} sources absolute path to its current text, the program roots
 * @returns {import('typescript').Program} other files parsed once and shared
 */
const checkerProgram = (ts, sources) => {
  const options = optionsOf(ts);
  const roots = new Map([...sources].map(([file, source]) => [resolve(file), source]));
  const host = ts.createCompilerHost(options, true);
  host.getSourceFile = (fileName, languageVersion) => {
    const source = roots.get(resolve(fileName));
    return source === undefined ? sharedFile(ts, fileName, languageVersion) : ts.createSourceFile(fileName, source, languageVersion, true);
  };
  return ts.createProgram({ rootNames: [...roots.keys()], options, host });
};

export { checkerProgram };
