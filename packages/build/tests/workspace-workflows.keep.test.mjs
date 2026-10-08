/* @layer tooling-scripts @kind test */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { syncApp } from '../src/modules/sync.mjs';
import { affectsApp } from '../src/release/affected-app.mjs';
import { renderWorkflows } from '../src/release/render-workflows.mjs';
import { brockWorkspace as monorepo, removeTempRepos, tempRepo as tree } from './temp-repo.mjs';

const CONFIG = { product: { id: 'atlas', name: 'Atlas' }, targets: ['windows', 'linux'], modules: [] };
const LIBUSB = { manifest: { ci: [{ name: 'Install libusb (Linux)', run: 'sudo apt-get install -y libusb-1.0-0-dev', os: 'linux' }] } };

afterEach(removeTempRepos);

describe('renderWorkflows', () => {
  it('writes both workflows at a standalone app root', () => {
    const root = tree({ '.git/HEAD': 'ref: refs/heads/main\n', 'brock.config.ts': '' });
    const files = renderWorkflows(root, CONFIG, []);
    expect(files.map((file) => file.path)).toEqual(['.github/workflows/ci.yml', '.github/workflows/release.yml']);
    expect(files[1].content).toContain('APP_DIR: .\n');
  });

  it('writes them at the repo root for the app of a Brock workspace, with its folder and module steps', () => {
    const root = monorepo();
    const files = renderWorkflows(join(root, 'apps/desktop'), CONFIG, [LIBUSB]);
    expect(files.map((file) => file.path)).toEqual(['../../.github/workflows/ci.yml', '../../.github/workflows/release.yml']);
    for (const { content } of files) expect(content).toContain('APP_DIR: apps/desktop\n');
    expect(files[1].content).toContain('needs: [prepare, build-windows, build-linux]');
    expect(files[0].content).toContain('Install libusb (Linux)');
  });

  it('writes none in a pnpm workspace that is not a Brock repo', () => {
    const plain = tree({ '.git/HEAD': '', 'pnpm-workspace.yaml': "packages:\n  - 'templates/*'\n", 'templates/app/brock.config.ts': '' });
    expect(renderWorkflows(join(plain, 'templates/app'), CONFIG, [])).toEqual([]);
  });
});

describe('renderWorkflows in a repo that releases several apps', () => {
  const twoApps = () => monorepo({ 'apps/tools/brock.config.ts': '', 'apps/tools/package.json': '{ "name": "@atlas/tools", "version": "0.1.0" }\n' });
  const withPrefix = (prefix) => ({ ...CONFIG, product: { ...CONFIG.product, releaseTagPrefix: prefix } });

  it('wants each app to name its tag prefix, which the updater reads too', () => {
    expect(() => renderWorkflows(join(twoApps(), 'apps/tools'), CONFIG, [])).toThrow("Set product.releaseTagPrefix in apps/tools/brock.config.ts, e.g. 'tools-v'");
  });

  it('gives each app its own CI and release workflow, and the first app the workspace CI', () => {
    const root = twoApps();
    const first = renderWorkflows(join(root, 'apps/desktop'), withPrefix('desktop-v'), []);
    expect(first.map((file) => file.path)).toEqual(['../../.github/workflows/ci.yml', '../../.github/workflows/ci-desktop.yml', '../../.github/workflows/release-desktop.yml']);
    const [workspace] = first;
    expect(workspace.content).toContain('  workspace:\n');
    expect(workspace.content).toContain('run: pnpm exec brock check');
    expect(workspace.content).not.toContain('APP_DIR');
    const tools = renderWorkflows(join(root, 'apps/tools'), withPrefix('tools-v'), []);
    expect(tools.map((file) => file.path)).toEqual(['../../.github/workflows/ci-tools.yml', '../../.github/workflows/release-tools.yml']);
  });

  it('builds and reviews an app only when a pull request touches it', () => {
    const [ci] = renderWorkflows(join(twoApps(), 'apps/tools'), withPrefix('tools-v'), []);
    expect(ci.content).toContain('name: CI tools\n');
    expect(ci.content).toContain('APP_DIR: apps/tools\n');
    expect(ci.content).toContain('run: echo "changed=$(pnpm exec brock affected "$APP_DIR" ${BASE:+"origin/$BASE"})" >> "$GITHUB_OUTPUT"');
    const gate = "    needs: changes\n    if: needs.changes.outputs.changed == 'true'\n";
    expect(ci.content).toContain(`  quality:\n${gate}`);
    expect(ci.content).toContain(`  review:\n${gate}`);
    expect(ci.content).toContain('name: review-tools');
    expect(ci.content).not.toContain('brock structure');
  });

  it('tags with the app prefix and reads the notes from the app folder', () => {
    const [, release] = renderWorkflows(join(twoApps(), 'apps/tools'), withPrefix('tools-v'), []);
    expect(release.content).toContain('name: Release tools\n');
    expect(release.content).toContain('TAG="tools-v$VERSION"');
    expect(release.content).toContain('NOTES="apps/tools/release-notes/v$VERSION.md"');
    expect(release.content).toContain('NOTES="apps/tools/release-notes/v${{ needs.prepare.outputs.version }}.md"');
    expect(release.content).toContain('group: release-tools\n');
  });
});

describe('brock affected', () => {
  const repo = () => monorepo({
    'apps/desktop/package.json': '{ "name": "@atlas/desktop", "dependencies": { "@atlas/model": "workspace:*" } }\n',
    'apps/tools/brock.config.ts': '',
    'apps/tools/package.json': '{ "name": "@atlas/tools" }\n',
    'packages/model/package.json': '{ "name": "@atlas/model" }\n',
  });
  const touches = (files, appDir = 'apps/desktop') => affectsApp({ rootDir: repo(), appDir, files });

  it('is true for the app own files and for a package it depends on', () => {
    expect(touches(['apps/desktop/src/main.tsx'])).toBe(true);
    expect(touches(['packages/model/src/index.ts'])).toBe(true);
    expect(touches(['packages/model/src/index.ts'], 'apps/tools')).toBe(false);
  });

  it('is false for another app, and true for a file outside every package', () => {
    expect(touches(['apps/tools/src/main.tsx'])).toBe(false);
    expect(touches(['pnpm-lock.yaml'])).toBe(true);
    expect(touches([])).toBe(false);
  });
});

describe('brock sync and check in a workspace', () => {
  it('keeps the repo root workflows and reports their drift', () => {
    const root = monorepo();
    const appDir = join(root, 'apps/desktop');
    const written = syncApp(appDir, CONFIG).written;
    expect(written).toEqual(expect.arrayContaining(['../../.github/workflows/ci.yml', '../../.github/workflows/release.yml']));
    expect(readFileSync(join(root, '.github/workflows/release.yml'), 'utf8')).toContain('APP_DIR: apps/desktop');
    expect(existsSync(join(appDir, '.github'))).toBe(false);
    expect(syncApp(appDir, CONFIG, { check: true }).drifted).not.toContain('../../.github/workflows/release.yml');
    writeFileSync(join(root, '.github/workflows/release.yml'), 'name: Release\n');
    expect(syncApp(appDir, CONFIG, { check: true }).drifted).toContain('../../.github/workflows/release.yml');
  });
});
