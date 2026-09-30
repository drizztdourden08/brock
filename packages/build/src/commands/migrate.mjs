/* @layer tooling-scripts @kind logic */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { loadBrockConfig } from '../load-config.mjs';
import { resolveModules } from '../modules/resolve.mjs';
import { collectMigrations } from '../upgrade/collect-migrations.mjs';
import { runMigrations } from '../upgrade/run-migrations.mjs';
import { selectMigrations } from '../upgrade/select-migrations.mjs';

const printRun = ({ applied, todos }, range) => {
  console.log(`brock migrate: ${applied.length} migration(s) after ${range.from}${range.to ? ` up to ${range.to}` : ''}.`);
  for (const m of applied) {
    console.log(`  ${m.version} ${m.id} (${m.source}): ${m.touched.length} file(s) changed`);
    for (const file of m.touched) console.log(`    ${file}`);
  }
  if (todos.length === 0) return;
  console.log('  To do by hand:');
  for (const todo of todos) console.log(`    ${todo.number}. ${todo.file}${todo.line ? `:${todo.line}` : ''} (${todo.migration}): ${todo.message}`);
};

/**
 * @param {{ rootDir: string, from?: string, to?: string, report?: string }} ctx
 * @returns {Promise<number>} exit code
 */
const runMigrate = async ({ rootDir, from, to, report }) => {
  if (!from) {
    console.error('brock migrate: --from <version> is required (the Brock version the app upgrades from).');
    return 1;
  }
  const config = await loadBrockConfig(rootDir);
  const { modules } = resolveModules(rootDir, config.modules ?? []);
  const range = { from, to: to ?? null };
  const run = await runMigrations(rootDir, selectMigrations(collectMigrations(modules), range));
  printRun(run, range);
  if (report) {
    const file = resolve(rootDir, report);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, `${JSON.stringify(run, null, 2)}\n`, 'utf8');
  }
  return 0;
};

export { runMigrate };
