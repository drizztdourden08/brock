/* @layer tooling-scripts @kind test */
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { targetForCwd } from '../src/launch/target-for-cwd.mjs';

const root = resolve('/repo');
const at = (app) => ({ appDir: (worktree) => resolve(worktree.path, app) });

describe('targetForCwd', () => {
  const targets = { desktop: at('apps/desktop'), tools: at('apps/tools'), site: {} };

  it('picks the app whose folder holds the folder the command runs in', () => {
    expect(targetForCwd(targets, root, join(root, 'apps', 'tools'))).toBe('tools');
    expect(targetForCwd(targets, root, join(root, 'apps', 'desktop', 'src'))).toBe('desktop');
  });

  it('finds none from the repo root or outside the apps', () => {
    expect(targetForCwd(targets, root, root)).toBeNull();
    expect(targetForCwd(targets, root, join(root, 'packages', 'design'))).toBeNull();
  });

  it('prefers the deepest folder when an app sits at the root', () => {
    const nested = { app: at('.'), desktop: at('apps/desktop') };
    expect(targetForCwd(nested, root, join(root, 'apps', 'desktop'))).toBe('desktop');
    expect(targetForCwd(nested, root, root)).toBe('app');
  });
});
