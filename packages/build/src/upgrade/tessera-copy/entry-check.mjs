/* @layer tooling-scripts @kind logic */
import { importMoves } from '../codemods/import-moves.mjs';
import { tesseraImports } from '../tessera/tessera-imports.mjs';
import { TESSERA_PACKAGE } from '../tessera/tessera-renames.constants.mjs';
import { tsSource } from '../tessera/ts-source.mjs';
import { TESSERA_ENTRIES } from './tessera-copy.constants.mjs';

const subpathOf = (module) => (module.startsWith(`${TESSERA_PACKAGE}/`) ? module.slice(TESSERA_PACKAGE.length + 1) : null);

const otherEntry = (name, entry, exports) => TESSERA_ENTRIES.find((other) => other !== entry && exports.get(other)?.has(name)) ?? null;

const reusedNote = (name, version) =>
  `${name} here is still the copy's part, and Tessera ${version} has a different part by that name. Check what the copy's ${name} became in Tessera's RENAMES.json (the copy's Badge is Status, its Stepper is NumberInput with buttons="sides") and write that.`;

const missingNote = (name, entry, version) =>
  `Tessera ${version} exports no ${name} from ${entry} or any other entry point. It came from inside the copy: find the Tessera part that replaces it (Tessera's MIGRATION.md), or keep that code in the app.`;

const findingOf = (entry, known) => {
  const subpath = subpathOf(entry.declaration.moduleSpecifier.text);
  const exported = subpath === null ? undefined : known.exports.get(subpath);
  if (exported === undefined) return null;
  const name = entry.imported;
  if (known.reused.has(name)) return { todo: reusedNote(name, known.version) };
  if (exported.has(name)) return null;
  const other = otherEntry(name, subpath, known.exports);
  if (other) return { move: { from: `${TESSERA_PACKAGE}/${subpath}`, to: `${TESSERA_PACKAGE}/${other}`, names: new Set([name]) } };
  return known.noted.has(name) ? null : { todo: missingNote(name, subpath, known.version) };
};

const findingsOf = (ts, file, known) =>
  tesseraImports(ts, file).map((entry) => ({ entry, finding: findingOf(entry, known) })).filter(({ finding }) => finding !== null);

/**
 * @param {typeof import('typescript')} ts
 * @param {{ path: string, source: string }} input a converted file, after the renames
 * @param {{ exports: Map<string, Set<string>>, reused: Set<string>, noted: Set<string>, version: string }} known from copyNames
 * @returns {{ source: string, todos: { line: number, message: string }[] }} moved names, to-dos
 */
const entryCheck = (ts, { path, source }, known) => {
  const moves = findingsOf(ts, tsSource.parse(ts, path, source), known).filter(({ finding }) => finding.move).map(({ finding }) => finding.move);
  const moved = importMoves({ moves, noTypescript: '', ts })({ path, source }).source;
  const file = tsSource.parse(ts, path, moved);
  const todos = findingsOf(ts, file, known).filter(({ finding }) => finding.todo).map(({ entry, finding }) => ({ line: tsSource.lineOf(file, entry.specifier), message: finding.todo }));
  return { source: moved, todos };
};

export { entryCheck };
