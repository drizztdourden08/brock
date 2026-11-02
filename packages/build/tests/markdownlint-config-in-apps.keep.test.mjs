/* @layer tooling-scripts @kind test */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { appScripts } from '../src/managed/app-scripts.mjs';
import { renderManagedFiles, rootOwnedTargets } from '../src/managed/templates.mjs';
import { syncApp } from '../src/modules/sync.mjs';
import { brockWorkspace, removeTempRepos } from './temp-repo.mjs';

afterEach(removeTempRepos);

const MARKDOWNLINT = '.markdownlint-cli2.mjs';
const paths = (opts) => renderManagedFiles(opts).map((file) => file.path);

describe('the markdownlint config of a workspace app', () => {
  it('K1 stays in a single app, with or without the lint:md script', { tags: ['critical'] }, () => {
    expect(paths()).toContain(MARKDOWNLINT);
    expect(paths({ scripts: { 'lint:md': 'markdownlint-cli2' } })).toContain(MARKDOWNLINT);
  });

  it('K1 stays with the root of a workspace for an app with no lint:md script', { tags: ['critical'] }, () => {
    expect(paths({ inWorkspace: true, scripts: {} })).not.toContain(MARKDOWNLINT);
    expect(paths({ inWorkspace: true })).not.toContain(MARKDOWNLINT);
    expect(rootOwnedTargets({})).toContain(MARKDOWNLINT);
  });

  it('K1 goes into a workspace app whose lint:md script runs markdownlint-cli2 in the app folder', { tags: ['critical'] }, () => {
    expect(paths({ inWorkspace: true, scripts: { 'lint:md': 'markdownlint-cli2' } })).toContain(MARKDOWNLINT);
    expect(rootOwnedTargets({ 'lint:md': 'markdownlint-cli2' })).not.toContain(MARKDOWNLINT);
  });

  it('S2 is written by brock sync in apps/desktop when its package.json has lint:md, and only then', { tags: ['standard'] }, () => {
    const withScript = brockWorkspace({ 'apps/desktop/package.json': '{ "name": "@atlas/desktop", "version": "0.2.0", "scripts": { "lint:md": "markdownlint-cli2" } }\n' });
    const app = join(withScript, 'apps', 'desktop');
    expect(appScripts(app)).toEqual({ 'lint:md': 'markdownlint-cli2' });
    const result = syncApp(app, { product: { id: 'atlas', name: 'Atlas' } }, { onMissing: 'skip' });
    expect(result.written).toContain(MARKDOWNLINT);
    expect(existsSync(join(app, MARKDOWNLINT))).toBe(true);

    const without = join(brockWorkspace(), 'apps', 'desktop');
    syncApp(without, { product: { id: 'atlas', name: 'Atlas' } }, { onMissing: 'skip' });
    expect(existsSync(join(without, MARKDOWNLINT))).toBe(false);
  });
});
