/* @layer tooling-scripts @kind test */
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, readdirSync, realpathSync, symlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { renderManagedFiles } from '../src/managed/templates.mjs';
import { syncApp } from '../src/modules/sync.mjs';
import { brockWorkspace, tempRepo, removeTempRepos } from './temp-repo.mjs';

afterEach(removeTempRepos);

const REPO = resolve(import.meta.dirname, '../../..');
const APP_MODULES = join(REPO, 'templates/app/node_modules');
const VITEST_DIR = realpathSync(join(REPO, 'node_modules/vitest'));
const BROCK_REACT = 'node_modules/@drizztdourden08/brock-react';

const PROBE = [
  "import { createElement } from 'react';",
  "import { renderToStaticMarkup } from 'react-dom/server';",
  "import { describe, expect, it } from 'vitest';",
  `import { PlatformProvider } from '../${BROCK_REACT}/src/platform/PlatformProvider/PlatformProvider';`,
  '',
  "describe('brock-react in an app test', () => {",
  "  it('renders a component that relies on the automatic JSX runtime', () => {",
  "    expect(renderToStaticMarkup(createElement(PlatformProvider, { children: 'inside' }))).toBe('inside');",
  '  });',
  '});',
  '',
].join('\n');

const link = (target, path) => {
  mkdirSync(dirname(path), { recursive: true });
  symlinkSync(target, path, 'junction');
};

const linkEntry = (appDir, scope, name) => {
  const from = scope ? join(APP_MODULES, scope, name) : join(APP_MODULES, name);
  link(realpathSync(from), join(appDir, 'node_modules', ...(scope ? [scope] : []), name));
};

const linkModules = (appDir) => {
  for (const entry of readdirSync(APP_MODULES)) {
    if (!entry.startsWith('@')) linkEntry(appDir, '', entry);
    else readdirSync(join(APP_MODULES, entry)).filter((name) => name !== 'brock-react').forEach((name) => linkEntry(appDir, entry, name));
  }
  link(VITEST_DIR, join(appDir, 'node_modules', 'vitest'));
};

const installBrockReact = (appDir) => {
  const source = join(REPO, 'packages/react');
  cpSync(join(source, 'src'), join(appDir, BROCK_REACT, 'src'), { recursive: true });
  cpSync(join(source, 'package.json'), join(appDir, BROCK_REACT, 'package.json'));
};

const runVitest = (appDir) => {
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('VITEST')));
  return spawnSync(process.execPath, [join(VITEST_DIR, 'vitest.mjs'), 'run', '--no-color'], { cwd: appDir, env, encoding: 'utf8', timeout: 120_000 });
};

const fixtureApp = () => {
  const config = renderManagedFiles({ scripts: { test: 'vitest run' } }).find((file) => file.path === 'vitest.config.ts');
  const appDir = tempRepo({
    'vitest.config.ts': config.content,
    'package.json': '{ "name": "fixture-app", "version": "0.1.0", "type": "module", "scripts": { "test": "vitest run" } }\n',
    'brock.config.ts': "export default { product: { id: 'fixture', name: 'Fixture' } };\n",
    'src/brock-react.test.tsx': PROBE,
  });
  linkModules(appDir);
  installBrockReact(appDir);
  return appDir;
};

describe('the managed vitest config of an app', () => {
  it('is written only for an app with a test script', () => {
    expect(renderManagedFiles({ scripts: { test: 'vitest run' } }).map((file) => file.path)).toContain('vitest.config.ts');
    expect(renderManagedFiles({ scripts: {} }).map((file) => file.path)).not.toContain('vitest.config.ts');
    expect(renderManagedFiles().map((file) => file.path)).not.toContain('vitest.config.ts');
  });

  it('is written by brock sync for an app with a test script, and a hand-written one is left alone', () => {
    const own = 'export default { test: { include: ["x"] } };\n';
    const pkg = '{ "name": "@atlas/desktop", "version": "0.2.0", "scripts": { "test": "vitest run" } }\n';
    const config = { product: { id: 'atlas', name: 'Atlas' } };
    const fresh = join(brockWorkspace({ 'apps/desktop/package.json': pkg }), 'apps', 'desktop');
    expect(syncApp(fresh, config, { onMissing: 'skip' }).written).toContain('vitest.config.ts');
    const app = join(brockWorkspace({ 'apps/desktop/package.json': pkg, 'apps/desktop/vitest.config.ts': own }), 'apps', 'desktop');
    expect(syncApp(app, config, { onMissing: 'skip' }).written).not.toContain('vitest.config.ts');
    expect(readFileSync(join(app, 'vitest.config.ts'), 'utf8')).toBe(own);
  });

  it('lets an app test render a brock-react component installed under node_modules', () => {
    const result = runVitest(fixtureApp());
    expect(`${result.stdout}${result.stderr}`).not.toContain('React is not defined');
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('1 passed');
  }, 150_000);
});
