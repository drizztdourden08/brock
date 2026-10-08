/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { loadBrockConfig } from '../load-config.mjs';
import { resolveModules } from '../modules/resolve.mjs';
import { brockPinOf } from '../upgrade/brock-pin-of.mjs';
import { collectMigrations } from '../upgrade/collect-migrations.mjs';
import { runMigrations } from '../upgrade/run-migrations.mjs';
import { selectMigrations } from '../upgrade/select-migrations.mjs';
import { tesseraRenamesStep } from '../upgrade/tessera/tessera-renames-step.mjs';
import { readCopyMap } from '../upgrade/tessera-copy/copy-map.mjs';
import { tesseraCopyStep } from '../upgrade/tessera-copy/tessera-copy-step.mjs';
import { runSync } from './sync.mjs';

const MISSING_FROM = 'brock migrate: --from <version> is required (the Brock version the app upgrades from), or --tessera-from <version> to replay the Tessera renames alone.';

const neverOnBrock = (rootDir) => [
  `brock migrate: ${rootDir} has no brock.version in its package.json or its workspace root's, so it was never on Brock and no Brock migration applies to it.`,
  'Adopt it first: brock adopt at the repo root pins brock.version to the Brock version it adopts, and later migrations start after that version.',
  'To replay only the Tessera renames, pass --tessera-from <version> without --from.',
].join('\n');

const copyRefusal = ({ rootDir, tesseraFrom, tesseraFromCopy, map }) => {
  if (!tesseraFromCopy) return null;
  if (tesseraFrom) return 'brock migrate: --tessera-from and --tessera-from-copy both set where the Tessera replay starts; pass one.';
  if (!map) return 'brock migrate: --tessera-from-copy needs --map <file>, the JSON that maps the folders of the copy to Tessera entry points (docs/upgrading-an-app.md).';
  const copyDir = resolve(rootDir, tesseraFromCopy);
  return existsSync(copyDir) ? null : `brock migrate: the copy folder ${copyDir} does not exist (--tessera-from-copy is relative to --root).`;
};

const copyStepOf = ({ rootDir, tesseraFromCopy, aliases, map }) => {
  const read = readCopyMap(resolve(process.cwd(), map));
  return read.refused ? read : tesseraCopyStep({ rootDir, copy: tesseraFromCopy, aliases: aliases ?? [], map: read.map });
};

const refusal = (ctx) => {
  const copy = copyRefusal(ctx);
  if (copy) return copy;
  const pinned = brockPinOf(ctx.rootDir) !== null;
  if (ctx.from || ctx.tesseraFrom || ctx.tesseraFromCopy) return ctx.from && !pinned ? neverOnBrock(ctx.rootDir) : null;
  return pinned ? MISSING_FROM : neverOnBrock(ctx.rootDir);
};

const tesseraStep = (ctx) => (ctx.tesseraFromCopy ? copyStepOf(ctx) : tesseraRenamesStep({ rootDir: ctx.rootDir, from: ctx.tesseraFrom ?? null }));

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
 * @param {{ rootDir: string, from?: string, to?: string, tesseraFrom?: string, tesseraFromCopy?: string, aliases?: string[], map?: string, report?: string }} ctx
 * @returns {Promise<number>} exit code; Brock migrations, then the Tessera renames
 */
const runMigrate = async (ctx) => {
  const { rootDir, from, to, report } = ctx;
  const refused = refusal(ctx);
  if (refused) {
    console.error(refused);
    return 1;
  }
  const range = { from: from ?? null, to: to ?? null };
  const brock = await brockRun(rootDir, range);
  const tessera = tesseraStep(ctx);
  if (tessera.refused) {
    console.error(`brock migrate: ${tessera.refused}`);
    return 1;
  }
  const run = withTessera(brock, tessera);
  printRun(run, range);
  if (report) writeReport(report, run);
  if (!brock.applied.some((m) => m.touched.length > 0)) return 0;
  console.log('brock migrate: migrations changed the app, so brock sync runs again to regenerate .brock.');
  return runSync({ rootDir });
};

export { runMigrate };
