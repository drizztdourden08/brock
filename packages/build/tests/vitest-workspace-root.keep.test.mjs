/* @layer tooling-scripts @kind test */
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { vitestBase } from '../src/vitest/vitest-base.mjs';
import { brockWorkspace, removeTempRepos } from './temp-repo.mjs';
import { APP_CONFIG, APP_PACKAGE, PROBE, VITEST_CONFIG, installApp, linkRootTools, runVitest } from './vitest-fixture.mjs';

afterEach(removeTempRepos);

const workspaceRoot = (skip) => {
  const root = brockWorkspace({
    'vitest.config.ts': VITEST_CONFIG,
    'apps/desktop/package.json': APP_PACKAGE,
    'apps/desktop/brock.config.ts': APP_CONFIG,
    'apps/desktop/src/brock-react.test.tsx': PROBE,
  });
  linkRootTools(root);
  installApp(join(root, 'apps', 'desktop'), { skip });
  return root;
};

const expectRendered = (skip) => {
  const result = runVitest(workspaceRoot(skip));
  expect(`${result.stdout}${result.stderr}`).not.toContain('Cannot find package');
  expect(result.status).toBe(0);
  expect(result.stdout).toContain('1 passed');
};

describe('the vitest config of a workspace root', () => {
  it('renders brock-react from the app that has react, with nothing installed at the root', () => {
    expectRendered();
  }, 150_000);

  it('still renders when the app lacks Tessera', () => {
    expectRendered(['@drizztdourden08/tessera']);
  }, 150_000);

  it('leaves a shared package that is not installed out of the config', async () => {
    const root = brockWorkspace({ 'node_modules/react/package.json': '{ "name": "react", "version": "19.0.0" }\n' });
    const config = await vitestBase(root, root);
    expect(config.resolve.dedupe).toEqual(['react']);
    expect(config.plugins).toBeUndefined();
  });
});
