/* @layer tooling-scripts @kind test */
import { realpathSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { configRoot } from '../config-root.mjs';
import { app, put, removeRoots } from './lint-fixture.mjs';

afterEach(removeRoots);

const CONFIG = 'export default [];';

describe('K1 the default rootDir of brockEslint', { tags: ['critical'] }, () => {
  it('is the folder of the nearest eslint.config file, not the folder ESLint runs from', () => {
    const root = app();
    put(root, 'eslint.config.mjs', CONFIG);
    put(root, 'apps/web/src/readme.txt', 'x');
    expect(realpathSync(configRoot(join(root, 'apps', 'web', 'src')))).toBe(realpathSync(root));
  });

  it('is the current folder when no eslint.config file sits above it', () => {
    const root = app();
    expect(realpathSync(configRoot(root))).toBe(realpathSync(root));
  });
});
