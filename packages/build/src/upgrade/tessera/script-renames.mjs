/* @layer tooling-scripts @kind logic */
import { componentRenames } from './component-renames.mjs';
import { jsxRenames } from './jsx-renames.mjs';
import { removedExports } from './removed-exports.mjs';
import { stringRenames } from './string-renames.mjs';
import { tesseraImports } from './tessera-imports.mjs';
import { tsSource } from './ts-source.mjs';
import { typedValues } from './typed-values.mjs';

const nameStage = (ts, file, release) => {
  const imports = tesseraImports(ts, file);
  return [componentRenames(ts, file, imports, release), jsxRenames(ts, file, imports, release), typedValues(ts, file, imports, release), removedExports(file, imports, release)];
};

const runStage = (ts, { path, source }, stage) => {
  const results = stage(tsSource.parse(ts, path, source));
  return { source: tsSource.applyEdits(source, results.flatMap((result) => result.edits)), todos: results.flatMap((result) => result.todos) };
};

/**
 * @param {typeof import('typescript')} ts
 * @param {{ path: string, source: string }} input a script file
 * @param {Record<string, any>} release one RENAMES.json release
 * @returns {{ source: string, todos: { line: number, message: string }[] }} names first, then strings
 */
const scriptRenames = (ts, { path, source }, release) => {
  const names = runStage(ts, { path, source }, (file) => nameStage(ts, file, release));
  const strings = runStage(ts, { path, source: names.source }, (file) => [stringRenames(ts, file, release)]);
  return { source: strings.source, todos: [...names.todos, ...strings.todos] };
};

export { scriptRenames };
