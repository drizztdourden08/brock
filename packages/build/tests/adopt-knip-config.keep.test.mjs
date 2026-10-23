/* @layer tooling-scripts @kind test */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { runAdopt } from '../src/commands/adopt.mjs';
import { knipJson } from '../src/commands/knip-config.mjs';
import { tempTree } from './temp-tree.mjs';

const { tempDir, put, cleanup } = tempTree('brock-adopt-knip-');

const workspaceRepo = () => {
  const root = tempDir();
  put(root, 'package.json', JSON.stringify({ name: 'acme' }));
  put(root, 'pnpm-workspace.yaml', "packages:\n  - 'apps/*'\n");
  put(root, 'apps/desktop/package.json', JSON.stringify({ name: '@acme/desktop' }));
  put(root, 'apps/desktop/brock.config.ts', 'export default {};\n');
  return root;
};

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  cleanup();
});

describe('knipJson for a workspace', () => {
  it('gives the root its own workspace so the lint configs and the workspace file are entries', () => {
    const { workspaces, entry } = JSON.parse(knipJson(workspaceRepo()));
    expect(entry).toBeUndefined();
    expect(workspaces['.'].entry).toEqual(expect.arrayContaining(['brock.workspace.mjs', 'eslint.config.mjs', 'stylelint.config.mjs', '.markdownlint-cli2.mjs']));
    expect(workspaces['.'].project).toEqual(['*.{mjs,ts}']);
    expect(workspaces['.'].ignoreBinaries).toEqual(['eslint', 'stylelint', 'markdownlint-cli2']);
  });

  it('keeps the root-only files out of the app workspace', () => {
    const { workspaces } = JSON.parse(knipJson(workspaceRepo()));
    expect(Object.keys(workspaces)).toEqual(['.', 'apps/desktop']);
    expect(workspaces['apps/desktop'].entry).not.toContain('brock.workspace.mjs');
    expect(workspaces['apps/desktop'].entry).not.toContain('.markdownlint-cli2.mjs');
  });

  it('keeps one top-level entry and no workspaces for a repo without apps in folders', () => {
    const root = tempDir();
    put(root, 'package.json', JSON.stringify({ name: 'solo' }));
    const knip = JSON.parse(knipJson(root));
    expect(knip.entry).toEqual(['brock.workspace.mjs']);
    expect(knip.workspaces).toBeUndefined();
  });
});

describe('brock adopt knip.json', () => {
  it('writes the root workspace on a fresh workspace', async () => {
    const root = workspaceRepo();
    expect(await runAdopt({ rootDir: root })).toBe(0);
    const knip = JSON.parse(readFileSync(join(root, 'knip.json'), 'utf8'));
    expect(Object.keys(knip.workspaces)).toEqual(['.', 'apps/desktop']);
    expect(knip.workspaces['.'].entry).toContain('brock.workspace.mjs');
  });
});
