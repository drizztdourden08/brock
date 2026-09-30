/* @layer tooling-scripts @kind logic */
import { brockInstallOf } from './brock-install.mjs';
import { runIn } from './run-in.mjs';
import { GATE_SCRIPTS, MIGRATIONS_FILE } from './upgrade.constants.mjs';

const scriptStep = (path, script) => ({
  name: `pnpm ${script}`,
  skipped: 'the app has no such script',
  run: () => (brockInstallOf.packageOf(path)?.scripts?.[script] ? runIn.pnpm(path, ['run', script]) : null),
});

const migrateArgs = (plan) => [
  'migrate',
  '--from', plan.current ?? '0.0.0',
  ...(plan.mode === 'registry' ? ['--to', plan.target] : []),
  '--report', MIGRATIONS_FILE,
];

/**
 * @param {{ path: string, name: string, plan: import('./upgrade.type.mjs').UpgradePlan, review: boolean }} worktree
 * @returns {{ name: string, run: () => number | null, skipped?: string }[]}
 */
const gateSteps = ({ path, name, plan, review }) => [
  { name: 'brock sync', run: () => runIn.brock(path, ['sync']) },
  { name: 'brock migrate', run: () => runIn.brock(path, migrateArgs(plan)) },
  ...GATE_SCRIPTS.map((script) => scriptStep(path, script)),
  { name: 'brock icons', skipped: '--no-review', run: () => (review ? runIn.brock(path, ['icons']) : null) },
  {
    name: `launch ${name} none --review`,
    skipped: '--no-review',
    run: () => (review ? runIn.brock(path, ['launch', name, 'none', '--review']) : null),
  },
];

export { gateSteps };
