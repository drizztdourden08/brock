/* @layer tooling-scripts @kind logic */
import { importMoves } from '../codemods/import-moves.mjs';
import { componentRenames } from './component-renames.mjs';
import { jsxRenames } from './jsx-renames.mjs';
import { releaseMoves } from './release-moves.mjs';
import { removedExports } from './removed-exports.mjs';
import { stringRenames } from './string-renames.mjs';
import { tesseraImports } from './tessera-imports.mjs';
import { USAGE_FILE } from './tessera-renames.constants.mjs';
import { tsSource } from './ts-source.mjs';
import { typedValues } from './typed-values.mjs';
import { usageRenames } from './usage-renames.mjs';

const NOTHING = Object.freeze({ edits: [], todos: [] });

const nameStage = (ts, file, release, typed) => {
  const imports = tesseraImports(ts, file);
  return [componentRenames(ts, file, imports, release), jsxRenames(ts, file, imports, release), typedValues(ts, file, imports, release), removedExports(ts, file, imports, release), typed];
};

const runStage = (ts, { path, source }, stage) => {
  const results = stage(tsSource.parse(ts, path, source));
  return { source: tsSource.applyEdits(source, results.flatMap((result) => result.edits)), todos: results.flatMap((result) => result.todos) };
};

const moveStage = (ts, { path, source }, release) => importMoves({ moves: releaseMoves(release), noTypescript: '', ts })({ path, source });

const snippetRenames = (ts, snippet, release) => {
  const names = runStage(ts, snippet, (file) => nameStage(ts, file, release, NOTHING));
  const moved = moveStage(ts, { path: snippet.path, source: names.source }, release);
  return { source: moved.source, todos: [...names.todos, ...moved.todos] };
};

const usageStage = (ts, { path, source }, release) => {
  if (!USAGE_FILE.test(path)) return { source, todos: [] };
  return runStage(ts, { path, source }, (file) => [usageRenames(ts, file, release, (snippet) => snippetRenames(ts, snippet, release))]);
};

/**
 * @param {typeof import('typescript')} ts
 * @param {{ path: string, source: string }} input a script file
 * @param {Record<string, any>} release one RENAMES.json release
 * @param {{ edits: { start: number, end: number, text: string }[], todos: { line: number, message: string }[] }} [typed] the typed object props, found on the same text
 * @returns {{ source: string, todos: { line: number, message: string }[] }} names, strings, usage parts, then the entry point moves
 */
const scriptRenames = (ts, { path, source }, release, typed = NOTHING) => {
  const names = runStage(ts, { path, source }, (file) => nameStage(ts, file, release, typed));
  const strings = runStage(ts, { path, source: names.source }, (file) => [stringRenames(ts, file, release)]);
  const usage = usageStage(ts, { path, source: strings.source }, release);
  const moved = moveStage(ts, { path, source: usage.source }, release);
  return { source: moved.source, todos: [...names.todos, ...strings.todos, ...usage.todos, ...moved.todos] };
};

export { scriptRenames };
