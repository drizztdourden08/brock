/* @layer tooling-scripts @kind logic */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ownedFiles } from './owned-files.mjs';

const loadMigration = async (entry) => {
  const { migration } = await import(pathToFileURL(entry.file).href);
  const valid = migration && typeof migration.id === 'string' && migration.files instanceof RegExp && typeof migration.apply === 'function';
  if (!valid) throw new Error(`${entry.file} does not export a migration { id, summary, files: RegExp, apply }.`);
  return migration;
};

const applyToFile = (rootDir, file, migration) => {
  const full = join(rootDir, file);
  const before = readFileSync(full, 'utf8');
  const result = migration.apply({ path: file, source: before }) ?? {};
  const changed = typeof result.source === 'string' && result.source !== before;
  if (changed) writeFileSync(full, result.source, 'utf8');
  return { changed, todos: result.todos ?? [] };
};

const runOne = async (rootDir, entry, files, todos) => {
  const migration = await loadMigration(entry);
  const touched = [];
  for (const file of files.filter((path) => migration.files.test(path))) {
    const { changed, todos: found } = applyToFile(rootDir, file, migration);
    if (changed) touched.push(file);
    for (const todo of found) todos.push({ number: todos.length + 1, migration: migration.id, file, line: todo.line ?? null, message: todo.message });
  }
  return { id: migration.id, version: entry.version, source: entry.source, summary: entry.summary ?? migration.summary ?? '', touched };
};

/**
 * @param {string} rootDir the app folder
 * @param {{ version: string, file: string, source: string, summary: string | null }[]} migrations in order
 * @returns {Promise<{ applied: { id: string, version: string, source: string, summary: string, touched: string[] }[], todos: { number: number, migration: string, file: string, line: number | null, message: string }[] }>}
 */
const runMigrations = async (rootDir, migrations) => {
  const files = ownedFiles(rootDir);
  const applied = [];
  const todos = [];
  for (const entry of migrations) applied.push(await runOne(rootDir, entry, files, todos));
  return { applied, todos };
};

export { runMigrations };
