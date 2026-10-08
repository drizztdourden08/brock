/* @layer tooling-scripts @kind logic */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { loadBrockConfig } from '../load-config.mjs';
import { resolveModules } from '../modules/resolve.mjs';
import { brockPinOf } from '../upgrade/brock-pin-of.mjs';
import { collectMigrations } from '../upgrade/collect-migrations.mjs';
import { runMigrations } from '../upgrade/run-migrations.mjs';
import { selectMigrations } from '../upgrade/select-migrations.mjs';
import { tesseraRenamesStep } from '../upgrade/tessera/tessera-renames-step.mjs';
import { runSync } from './sync.mjs';

const MISSING_FROM = 'brock migrate: --from <version> is required (the Brock version the app upgrades from), or --tessera-from <version> to replay the Tessera renames alone.';

const neverOnBrock = (rootDir) => [
  `brock migrate: ${rootDir} has no brock.version in its package.json or its workspace root's, so it was never on Brock and no Brock migration applies to it.`,
  'Adopt it first: brock adopt at the repo root pins brock.version to the Brock version it adopts, and later migrations start after that version.',
  'To replay only the Tessera renames, pass --tessera-from <version> without --from.',
].join('\n');

const refusal = ({ rootDir, from, tesseraFrom }) => {
  const pinned = brockPinOf(rootDir) !== null;
  if (from || tesseraFrom) return from && !pinned ? neverOnBrock(rootDir) : null;
  return pinned ? MISSING_FROM : neverOnBrock(rootDir);
};

const printTodos = (todos) => {
  if (todos.length === 0) return;
  console.log('  To do by hand:');
  for (const todo of todos) console.log(`    ${todo.number}. ${todo.file}${todo.line ? `:${todo.line}` : ''} (${todo.migration}): ${todo.message}`);
};

const printTessera = ({ skipped, range, pinned, warnings }) => {
  if (skipped) {
    console.log(`  Tessera renames skipped: ${skipped}.`);
    return;
  }
  console.log(`  Tessera renames from ${range.from} to ${range.to}${range.next ? ', with next (Tessera main)' : ''}${pinned ? `; brock.tessera pins ${pinned}` : ''}.`);
  for (const warning of warnings) console.warn(`  Warning: ${warning}`);
};

const printRun = ({ applied, todos, tessera }, range) => {
  console.log(`brock migrate: ${applied.length} migration(s)${range.from ? ` after ${range.from}${range.to ? ` up to ${range.to}` : ''}` : ''}.`);
  for (const m of applied) {
    console.log(`  ${m.version} ${m.id} (${m.source}): ${m.touched.length} file(s) changed`);
    for (const file of m.touched) console.log(`    ${file}`);
  }
  printTessera(tessera);
  printTodos(todos);
};

const brockRun = async (rootDir, range) => {
  if (!range.from) return { applied: [], todos: [] };
  const config = await loadBrockConfig(rootDir);
  const { modules } = resolveModules(rootDir, config.modules ?? []);
  return runMigrations(rootDir, selectMigrations(collectMigrations(modules), range));
};

const withoutTodos = (entry) => Object.fromEntries(Object.entries(entry).filter(([key]) => key !== 'todos'));

const withTessera = (run, { applied, ...tessera }) => {
  const todos = [...run.todos];
  for (const { todos: found, ...entry } of applied) {
    for (const todo of found) todos.push({ number: todos.length + 1, migration: entry.id, file: todo.file, line: todo.line ?? null, message: todo.message });
  }
  return { applied: [...run.applied, ...applied.map(withoutTodos)], todos, tessera };
};

const writeReport = (report, run) => {
  const file = resolve(process.cwd(), report);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(run, null, 2)}\n`, 'utf8');
  console.log(`  Report: ${file}`);
};

/**
 * @param {{ rootDir: string, from?: string, to?: string, tesseraFrom?: string, report?: string }} ctx
 * @returns {Promise<number>} exit code; Brock migrations, then the Tessera renames
 */
const runMigrate = async ({ rootDir, from, to, tesseraFrom, report }) => {
  const refused = refusal({ rootDir, from, tesseraFrom });
  if (refused) {
    console.error(refused);
    return 1;
  }
  const range = { from: from ?? null, to: to ?? null };
  const brock = await brockRun(rootDir, range);
  const run = withTessera(brock, tesseraRenamesStep({ rootDir, from: tesseraFrom ?? null }));
  printRun(run, range);
  if (report) writeReport(report, run);
  if (!brock.applied.some((m) => m.touched.length > 0)) return 0;
  console.log('brock migrate: migrations changed the app, so brock sync runs again to regenerate .brock.');
  return runSync({ rootDir });
};

export { runMigrate };
