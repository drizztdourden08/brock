/* @layer tooling-scripts @kind test */
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { repoOwnerOf } from '../src/release/repo-owner.mjs';
import { removeTempRepos, tempRepo } from './temp-repo.mjs';

afterEach(removeTempRepos);

const CONFIG = '[core]\n\tbare = false\n[remote "origin"]\n\turl = https://github.com/Acme-Org/atlas.git\n';

describe('the repo owner', () => {
  it('reads the origin remote of a plain checkout', () => {
    const root = tempRepo({ '.git/config': CONFIG });
    expect(repoOwnerOf(root)).toBe('acme-org');
  });

  it('reads the origin remote of the main repo from a linked worktree', () => {
    const main = tempRepo({ '.git/config': CONFIG, '.git/worktrees/feature/commondir': '../..\n', '.git/worktrees/feature/HEAD': 'ref: refs/heads/feature\n' });
    const worktree = tempRepo({ '.git': `gitdir: ${join(main, '.git', 'worktrees', 'feature')}\n` });
    expect(repoOwnerOf(worktree)).toBe('acme-org');
  });

  it('falls back to the repository field when there is no remote', () => {
    const root = tempRepo({ 'package.json': '{ "repository": "github:Acme-Org/atlas" }\n' });
    expect(repoOwnerOf(root)).toBe('acme-org');
  });
});
