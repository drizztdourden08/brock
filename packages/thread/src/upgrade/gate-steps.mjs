/* @layer tooling-scripts @kind logic */
import { brockInstallOf } from './brock-install.mjs';
import { runIn } from './run-in.mjs';
import { GATE_SCRIPTS, MIGRATIONS_FILE } from './upgrade.constants.mjs';

const inApp = (name, { label }) => (label === '.' ? name : `${name} in ${label}`);

const scriptStep = (place, script) => ({
  name: inApp(`pnpm ${script}`, place),
  skipped: 'no such script there',
  run: () => (brockInstallOf.packageOf(place.dir)?.scripts?.[script] ? runIn.pnpm(place.dir, ['run', script]) : null),
});

const migrateArgs = (plan, app) => [
  'migrate',
  '--from', app.from ?? '0.0.0',
  ...(plan.mode === 'registry' ? ['--to', plan.target] : []),
  ...(app.tesseraFrom ? ['--tessera-from', app.tesseraFrom] : []),
  '--report', MIGRATIONS_FILE,
];

const appSteps = (plan, app) => [
  { name: inApp('brock sync', app), run: () => runIn.brock(app.dir, ['sync']) },
  { name: inApp('brock migrate', app), run: () => runIn.brock(app.dir, migrateArgs(plan, app)) },
];

const scriptPlaces = (path, apps) => [{ dir: path, label: '.' }, ...apps.filter((app) => app.dir !== path)];

const reviewSteps = ({ path, name, review, apps }) => [
  ...apps.map((app) => ({ name: inApp('brock icons', app), skipped: '--no-review', run: () => (review ? runIn.brock(app.dir, ['icons']) : null) })),
  {
    name: `launch ${name} none --review`,
    skipped: '--no-review',
    run: () => (review ? runIn.brock(path, ['launch', name, 'none', '--review'], apps.map((app) => app.dir)) : null),
  },
];

/**
 * @param {{ path: string, name: string, plan: import('./upgrade.type.mjs').UpgradePlan, review: boolean, apps: import('./upgrade.type.mjs').UpgradeApp[] }} worktree
 * @returns {{ name: string, run: () => number | null, skipped?: string }[]}
 */
const gateSteps = (worktree) => [
  ...worktree.apps.flatMap((app) => appSteps(worktree.plan, app)),
  ...scriptPlaces(worktree.path, worktree.apps).flatMap((place) => GATE_SCRIPTS.map((script) => scriptStep(place, script))),
  ...reviewSteps(worktree),
];

export { gateSteps };
