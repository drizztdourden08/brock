/* @layer tooling-scripts @kind test */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { appDirs } from '../src/upgrade/app-dirs.mjs';
import { bumpApp } from '../src/upgrade/bump-app.mjs';
import { coversEveryPackage } from '../src/upgrade/covers-every-package.mjs';
import { gateSteps } from '../src/upgrade/gate-steps.mjs';
import { upgradeApps } from '../src/upgrade/upgrade-apps.mjs';
import { WORKSPACE_YAML, checkout, monorepo, readJson, removeMadeDirs, write } from './upgrade-monorepo-fixture.mjs';

afterEach(removeMadeDirs);

describe('K1 appDirs', { tags: ['critical'] }, () => {
  it('finds the app in a workspace package, or the root app alone', () => {
    const root = monorepo();
    expect(appDirs(root)).toEqual([join(root, 'apps', 'desktop')]);
    write(root, { 'brock.config.ts': 'export default {};\n' });
    expect(appDirs(root)).toEqual([root]);
  });
});

describe('K1 brock upgrade in a monorepo whose app lives in apps/desktop', { tags: ['critical'] }, () => {
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
});

describe('K1 the upgrade gate in a monorepo', { tags: ['critical'] }, () => {
  it('runs the gate scripts at the root and in the app, and the review from the root', () => {
    const root = monorepo();
    const apps = upgradeApps(root, { current: '0.16.0' });
    const names = gateSteps({ path: root, name: 'brock-0-17-0', plan: { mode: 'link', target: '0.17.0' }, review: true, apps }).map((step) => step.name);
    expect(names).toEqual([
      'brock sync in apps/desktop', 'brock migrate in apps/desktop',
      'pnpm install --frozen-lockfile', 'brock check in apps/desktop',
      'pnpm lint', 'pnpm typecheck', 'pnpm lint:md', 'pnpm structure', 'pnpm test',
      'pnpm lint in apps/desktop', 'pnpm typecheck in apps/desktop', 'pnpm lint:md in apps/desktop', 'pnpm structure in apps/desktop', 'pnpm test in apps/desktop',
      'brock gate in apps/desktop',
      'brock icons in apps/desktop', 'launch brock-0-17-0 none --review',
    ]);
  });
});

describe('K1 the upgrade gate in each app of a monorepo', { tags: ['critical'] }, () => {
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
