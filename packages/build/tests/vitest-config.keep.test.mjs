/* @layer tooling-scripts @kind test */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { renderManagedFiles } from '../src/managed/templates.mjs';
import { syncApp } from '../src/modules/sync.mjs';
import { brockWorkspace, tempRepo, removeTempRepos } from './temp-repo.mjs';
import { APP_CONFIG, APP_PACKAGE, PROBE, installApp, runVitest } from './vitest-fixture.mjs';

afterEach(removeTempRepos);

const fixtureApp = () => {
  const config = renderManagedFiles({ scripts: { test: 'vitest run' } }).find((file) => file.path === 'vitest.config.ts');
  const appDir = tempRepo({
    'vitest.config.ts': config.content,
    'package.json': APP_PACKAGE,
    'brock.config.ts': APP_CONFIG,
    'src/brock-react.test.tsx': PROBE,
  });
  installApp(appDir);
  return appDir;
};

describe('K3 the managed vitest config of an app', () => {
  it('is written by brock sync for an app with a test script, and a hand-written one is left alone', { tags: ['critical'] }, () => {
    const own = 'export default { test: { include: ["x"] } };\n';
    const pkg = '{ "name": "@atlas/desktop", "version": "0.2.0", "scripts": { "test": "vitest run" } }\n';
    const config = { product: { id: 'atlas', name: 'Atlas' } };
    const fresh = join(brockWorkspace({ 'apps/desktop/package.json': pkg }), 'apps', 'desktop');
    expect(syncApp(fresh, config, { onMissing: 'skip' }).written).toContain('vitest.config.ts');
    const app = join(brockWorkspace({ 'apps/desktop/package.json': pkg, 'apps/desktop/vitest.config.ts': own }), 'apps', 'desktop');
    expect(syncApp(app, config, { onMissing: 'skip' }).written).not.toContain('vitest.config.ts');
    expect(readFileSync(join(app, 'vitest.config.ts'), 'utf8')).toBe(own);
  });

  it('E2 lets an app test render a brock-react component installed under node_modules', { tags: ['e2e'] }, () => {
    const result = runVitest(fixtureApp());
    expect(`${result.stdout}${result.stderr}`).not.toContain('React is not defined');
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('1 passed');
  });
});
