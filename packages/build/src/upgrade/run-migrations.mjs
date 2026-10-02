/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ownedFiles } from './owned-files.mjs';

const hasFileStep = (migration) => migration.files instanceof RegExp && typeof migration.apply === 'function';

const hasWorkspaceStep = (migration) => typeof migration.workspace === 'function';

const loadMigration = async (entry) => {
  const { migration } = await import(pathToFileURL(entry.file).href);
  const valid = migration && typeof migration.id === 'string' && (hasFileStep(migration) || hasWorkspaceStep(migration));
  if (!valid) throw new Error(`${entry.file} does not export a migration { id, summary, files: RegExp, apply } or { id, summary, workspace }.`);
  return { entry, migration };
};

const workspaceLast = (loaded) => {
  const versions = [...new Set(loaded.map(({ entry }) => entry.version))];
  const rank = ({ entry, migration }) => versions.indexOf(entry.version) * 2 + (hasWorkspaceStep(migration) ? 1 : 0);
  return loaded.map((item, index) => ({ item, index })).sort((a, b) => rank(a.item) - rank(b.item) || a.index - b.index).map(({ item }) => item);
};

const renameTarget = (rootDir, file, rename) =>
  typeof rename === 'string' && rename !== file && !existsSync(join(rootDir, rename)) ? rename : null;

const applyToFile = (rootDir, file, migration) => {
  const full = join(rootDir, file);
  const before = readFileSync(full, 'utf8');
  const result = migration.apply({ path: file, source: before }) ?? {};
  const changed = typeof result.source === 'string' && result.source !== before;
  if (changed) writeFileSync(full, result.source, 'utf8');
  const renamed = renameTarget(rootDir, file, result.rename);
  if (renamed) renameSync(full, join(rootDir, renamed));
  const blocked = typeof result.rename === 'string' && result.rename !== file && renamed === null;
  const todos = [...(result.todos ?? []), ...(blocked ? [{ line: null, message: `rename it to ${result.rename}, which already exists; merge the two files by hand` }] : [])];
  return { changed: changed || renamed !== null, renamed, todos };
};

const recordTodo = (todos, migration, file, todo) =>
  todos.push({ number: todos.length + 1, migration: migration.id, file, line: todo.line ?? null, message: todo.message });

const followMoves = (todos, moved) => {
  for (const todo of todos) {
    const move = moved.find(({ from }) => todo.file === from || todo.file.startsWith(`${from}/`));
    if (move) todo.file = `${move.to}${todo.file.slice(move.from.length)}`;
  }
};

const runWorkspaceStep = async (rootDir, migration, files, todos) => {
  const result = (await migration.workspace({ rootDir })) ?? {};
  followMoves(todos, result.moved ?? []);
  for (const todo of result.todos ?? []) recordTodo(todos, migration, todo.file, todo);
  files.splice(0, files.length, ...ownedFiles(rootDir));
  return result.touched ?? [];
};

const runFileStep = (rootDir, migration, files, todos) => {
  const touched = [];
  for (const file of files.filter((path) => migration.files.test(path))) {
    const { changed, renamed, todos: found } = applyToFile(rootDir, file, migration);
    if (renamed) files.splice(files.indexOf(file), 1, renamed);
    if (changed) touched.push(renamed ? `${file} -> ${renamed}` : file);
    for (const todo of found) recordTodo(todos, migration, renamed ?? file, todo);
  }
  return touched;
};

const runOne = async (rootDir, { entry, migration }, files, todos) => {
  const touched = hasWorkspaceStep(migration) ? await runWorkspaceStep(rootDir, migration, files, todos) : [];
  if (hasFileStep(migration)) touched.push(...runFileStep(rootDir, migration, files, todos));
  return { id: migration.id, version: entry.version, source: entry.source, summary: entry.summary ?? migration.summary ?? '', touched };
};

/**
 * @param {string} rootDir the app folder
 * @param {{ version: string, file: string, source: string, summary: string | null }[]} migrations in order
 * @returns {Promise<{ applied: { id: string, version: string, source: string, summary: string, touched: string[] }[], todos: { number: number, migration: string, file: string, line: number | null, message: string }[] }>}
 */
const runMigrations = async (rootDir, migrations) => {
  const loaded = workspaceLast(await Promise.all(migrations.map(loadMigration)));
  const files = ownedFiles(rootDir);
  const applied = [];
  const todos = [];
  for (const item of loaded) applied.push(await runOne(rootDir, item, files, todos));
  return { applied, todos };
};

export { runMigrations };
