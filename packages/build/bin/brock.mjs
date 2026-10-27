/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const IDLE_ARGS = ['sync', '--if-stale'];

const isIdleSync = () => {
  const args = process.argv.slice(2);
  const sameArgs = args.length === IDLE_ARGS.length && IDLE_ARGS.every((arg, index) => args[index] === arg);
  return sameArgs && existsSync(join(process.cwd(), 'brock.config.ts')) && !existsSync(join(process.cwd(), 'brock.site.ts'));
};

const runIdleSync = async () => {
  const { syncIfStaleLater } = await import('../src/freshness/sync-if-stale.mjs');
  const { problem, guide } = await syncIfStaleLater(process.cwd());
  await guide();
  if (!problem) return 0;
  console.error(`brock sync: ${problem}`);
  return 1;
};

if (isIdleSync()) {
  runIdleSync().then(
    (code) => process.exit(code),
    (error) => {
      console.error(`brock: ${error?.message ?? error}`);
      process.exit(1);
    },
  );
} else {
  await import('./brock-main.mjs');
}
