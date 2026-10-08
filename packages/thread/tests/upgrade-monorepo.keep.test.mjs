/* @layer tooling-scripts @kind test */
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { appDirs } from '../src/upgrade/app-dirs.mjs';
import { bumpApp } from '../src/upgrade/bump-app.mjs';
import { coversEveryPackage } from '../src/upgrade/covers-every-package.mjs';
import { gateSteps } from '../src/upgrade/gate-steps.mjs';
import { runSteps } from '../src/upgrade/run-steps.mjs';
import { upgradeApps } from '../src/upgrade/upgrade-apps.mjs';
import { writeReports } from '../src/upgrade/write-reports.mjs';

const made = [];

const write = (root, files) => {
  for (const [file, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), typeof content === 'string' ? content : JSON.stringify(content, null, 2));
  }
  return root;
};

const tempDir = (name) => {
  const dir = mkdtempSync(join(tmpdir(), name));
  made.push(dir);
  return dir;
};

const STUB_BROCK = [
  "import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';",
  "import { dirname, join } from 'node:path';",
  'const args = process.argv.slice(2);',
  "appendFileSync(process.env.BROCK_STUB_LOG, `${JSON.stringify({ cwd: process.cwd(), args })}\\n`);",
  "const report = args.indexOf('--report');",
  'if (report !== -1) {',
  '  const file = join(process.cwd(), args[report + 1]);',
  '  mkdirSync(dirname(file), { recursive: true });',
  "  writeFileSync(file, JSON.stringify({ applied: [{ id: 'stub-step', version: '0.17.0', source: 'brock-build', summary: 'stub', touched: ['src/app.ts'] }], todos: [] }));",
  '}',
].join('\n');

const WORKSPACE_YAML = [
  'packages:',
  '  - apps/*',
  '  - packages/*',
  '',
  'catalog:',
  "  '@drizztdourden08/brock-core': ^0.16.0",
  '  "@drizztdourden08/brock-electron": "^0.16.0"',
  "  '@drizztdourden08/tessera': ^0.15.0",
  '  react: ^19.2.6',
  '',
].join('\n');

const monorepo = () => write(tempDir('thread-upgrade-monorepo-'), {
  'package.json': { name: 'fixture', private: true, brock: { version: '0.16.0' }, devDependencies: { '@drizztdourden08/brock-build': '^0.16.0', vitest: 'catalog:' } },
  'pnpm-workspace.yaml': WORKSPACE_YAML,
  'apps/desktop/brock.config.ts': 'export default {};\n',
  'apps/desktop/package.json': {
    name: '@fixture/desktop',
    main: 'dist/electron/main.js',
    dependencies: { '@drizztdourden08/brock-core': 'catalog:', '@drizztdourden08/brock-react': '^0.16.0', '@drizztdourden08/tessera': 'catalog:', '@fixture/model': 'workspace:*', react: 'catalog:' },
    devDependencies: { '@drizztdourden08/brock-build': '^0.16.0' },
    brock: { version: '0.16.0', tessera: '0.15.0' },
  },
  'apps/desktop/node_modules/@drizztdourden08/brock-build/bin/brock.mjs': STUB_BROCK,
  'packages/model/package.json': { name: '@fixture/model', dependencies: { '@drizztdourden08/brock-core': '^0.16.0' } },
  'packages/tools/package.json': { name: '@fixture/tools', dependencies: { zod: '^4.0.0' } },
});

const checkout = () => write(tempDir('thread-upgrade-checkout-'), {
  'packages/build/package.json': { name: '@drizztdourden08/brock-build', version: '0.17.0' },
  'packages/react/package.json': { name: '@drizztdourden08/brock-react', version: '0.17.0', peerDependencies: { '@drizztdourden08/tessera': '^0.16.0' } },
});

const readJson = (root, file) => JSON.parse(readFileSync(join(root, file), 'utf8'));

afterEach(() => {
  delete process.env.BROCK_STUB_LOG;
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('appDirs', () => {
  it('finds the app in a workspace package, or the root app alone', () => {
    const root = monorepo();
    expect(appDirs(root)).toEqual([join(root, 'apps', 'desktop')]);
    write(root, { 'brock.config.ts': 'export default {};\n' });
    expect(appDirs(root)).toEqual([root]);
  });
});

describe('brock upgrade in a monorepo whose app lives in apps/desktop', () => {
  it('bumps the root, the app, the other Brock packages and the catalog', () => {
    const root = monorepo();
    const plan = { mode: 'link', current: '0.16.0', target: '0.17.0', checkout: checkout(), relink: false };
    const apps = upgradeApps(root, plan);
    expect(apps).toEqual([{ dir: join(root, 'apps', 'desktop'), label: 'apps/desktop', from: '0.16.0', tesseraFrom: '0.15.0' }]);

    const fields = bumpApp(root, plan, apps.map((app) => app.dir));
    expect(fields).toEqual([
      'brock.version',
      'devDependencies.@drizztdourden08/brock-build',
      'apps/desktop: brock.version',
      'apps/desktop: dependencies.@drizztdourden08/brock-react',
      'apps/desktop: devDependencies.@drizztdourden08/brock-build',
      'catalog.@drizztdourden08/tessera',
      'packages/model: dependencies.@drizztdourden08/brock-core',
      'catalog.@drizztdourden08/brock-core',
      'catalog.@drizztdourden08/brock-electron',
    ]);
    expect(readJson(root, 'package.json').brock.version).toBe('0.17.0');
    expect(readJson(root, 'apps/desktop/package.json').brock).toEqual({ version: '0.17.0', tessera: '0.15.0' });
    expect(readJson(root, 'packages/model/package.json')).toEqual({ name: '@fixture/model', dependencies: { '@drizztdourden08/brock-core': '^0.17.0' } });
    expect(readJson(root, 'packages/tools/package.json').brock).toBeUndefined();
    expect(readFileSync(join(root, 'pnpm-workspace.yaml'), 'utf8')).toBe(WORKSPACE_YAML
      .replace("'@drizztdourden08/brock-core': ^0.16.0", "'@drizztdourden08/brock-core': ^0.17.0")
      .replace('"@drizztdourden08/brock-electron": "^0.16.0"', '"@drizztdourden08/brock-electron": "^0.17.0"')
      .replace("'@drizztdourden08/tessera': ^0.15.0", "'@drizztdourden08/tessera': ^0.16.0"));
    expect(bumpApp(root, plan, apps.map((app) => app.dir))).toEqual([]);
  });

  it('syncs and migrates in the app from its own pins, and writes the report there', () => {
    const root = monorepo();
    const plan = { mode: 'link', current: '0.16.0', target: '0.17.0', checkout: checkout(), relink: false };
    const apps = upgradeApps(root, plan);
    const fields = bumpApp(root, plan, apps.map((app) => app.dir));
    process.env.BROCK_STUB_LOG = join(root, 'brock-calls.log');
    const steps = gateSteps({ path: root, name: 'brock-0-17-0', plan: { ...plan, mode: 'registry' }, review: false, apps });
    const { results, failed } = runSteps(steps.filter((step) => step.name.startsWith('brock sync') || step.name.startsWith('brock migrate')), () => {});
    expect(failed).toBeNull();
    expect(results.map((step) => `${step.name}: ${step.status}`)).toEqual(['brock sync in apps/desktop: passed', 'brock migrate in apps/desktop: passed']);
    const calls = readFileSync(process.env.BROCK_STUB_LOG, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
    expect(calls.map(({ cwd }) => cwd)).toEqual([join(root, 'apps', 'desktop'), join(root, 'apps', 'desktop')]);
    expect(calls[0].args).toEqual(['sync']);
    expect(calls[1].args).toEqual(['migrate', '--from', '0.16.0', '--to', '0.17.0', '--tessera-from', '0.15.0', '--report', '.user-data/upgrade-migrations.json']);

    const reports = writeReports({ app: 'fixture', plan, worktree: { path: root, branch: 'brock-0-17-0' }, apps }, { fields, steps: results, failed }, []);
    expect(reports).toEqual([join(root, 'apps', 'desktop', '.brock', 'upgrade-report.md')]);
    const report = readFileSync(reports[0], 'utf8');
    expect(report).toContain('- App: fixture (apps/desktop)');
    expect(report).toContain('- 0.17.0 stub-step (brock-build): stub');
    expect(report).toContain('- apps/desktop: brock.version');
    expect(existsSync(join(root, '.brock', 'upgrade-report.md'))).toBe(false);
  });
});

describe('the upgrade gate in a monorepo', () => {
  it('runs the gate scripts at the root and in the app, and the review from the root', () => {
    const root = monorepo();
    const apps = upgradeApps(root, { current: '0.16.0' });
    const names = gateSteps({ path: root, name: 'brock-0-17-0', plan: { mode: 'link', target: '0.17.0' }, review: true, apps }).map((step) => step.name);
    expect(names).toEqual([
      'brock sync in apps/desktop', 'brock migrate in apps/desktop',
      'pnpm lint', 'pnpm typecheck', 'pnpm structure', 'pnpm test',
      'pnpm lint in apps/desktop', 'pnpm typecheck in apps/desktop', 'pnpm structure in apps/desktop', 'pnpm test in apps/desktop',
      'brock gate in apps/desktop',
      'brock icons in apps/desktop', 'launch brock-0-17-0 none --review',
    ]);
  });

  it('runs the app gate steps of brock.config.ts through brock gate in each app', () => {
    const root = monorepo();
    process.env.BROCK_STUB_LOG = join(root, 'brock-calls.log');
    const apps = upgradeApps(root, { current: '0.16.0' });
    const steps = gateSteps({ path: root, name: 'brock-0-17-0', plan: { mode: 'link', target: '0.17.0' }, review: false, apps });
    const { results } = runSteps(steps.filter((step) => step.name === 'brock gate in apps/desktop'), () => {});
    expect(results.map((step) => step.status)).toEqual(['passed']);
    const [call] = readFileSync(process.env.BROCK_STUB_LOG, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
    expect(call).toEqual({ cwd: join(root, 'apps', 'desktop'), args: ['gate'] });
  });

  it('skips an app script when the root script of that name already runs it in every package', () => {
    const root = monorepo();
    write(root, { 'package.json': { name: 'fixture', private: true, scripts: { lint: 'pnpm -r lint', test: 'vitest run', typecheck: 'pnpm -r --filter ./apps/* typecheck' } } });
    write(root, { 'apps/desktop/package.json': { name: '@fixture/desktop', scripts: { lint: 'exit 1', test: 'exit 1', typecheck: 'exit 1' } } });
    const apps = upgradeApps(root, { current: '0.16.0' });
    const steps = gateSteps({ path: root, name: 'brock-0-17-0', plan: { mode: 'link', target: '0.17.0' }, review: false, apps });
    const lint = steps.find((step) => step.name === 'pnpm lint in apps/desktop');
    expect(lint?.run()).toBeNull();
    expect(lint?.skipped).toMatch(/pnpm -r/);
    expect(steps.find((step) => step.name === 'pnpm typecheck in apps/desktop')?.skipped).toBe('no such script there');
  });

  it('reads pnpm -r in a root script as covering every package, but not with a filter or another script', () => {
    expect(coversEveryPackage('pnpm -r lint', 'lint')).toBe(true);
    expect(coversEveryPackage('pnpm typecheck && pnpm --recursive run lint', 'lint')).toBe(true);
    expect(coversEveryPackage('pnpm -r --filter ./apps/* lint', 'lint')).toBe(false);
    expect(coversEveryPackage('pnpm -r --filter=./apps/* lint', 'lint')).toBe(false);
    expect(coversEveryPackage('pnpm -r typecheck && eslint .', 'lint')).toBe(false);
    expect(coversEveryPackage('eslint .', 'lint')).toBe(false);
    expect(coversEveryPackage(undefined, 'lint')).toBe(false);
  });

  it('starts each app from the main checkout pins, so a resumed upgrade migrates again', () => {
    const main = monorepo();
    const worktree = monorepo();
    write(worktree, { 'apps/desktop/package.json': { name: '@fixture/desktop', brock: { version: '0.17.0', tessera: '0.16.0' } } });
    const [app] = upgradeApps(worktree, { current: '0.16.0' }, main);
    expect(app).toMatchObject({ dir: join(worktree, 'apps', 'desktop'), from: '0.16.0', tesseraFrom: '0.15.0' });
  });
});
