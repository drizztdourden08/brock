/* @layer tooling-scripts @kind test */
import { utimesSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { appLookCache } from '../src/look/app-look-cache.mjs';
import { lookFiles } from '../src/look/look-files.mjs';
import { tempTree } from './temp-tree.mjs';

const tree = tempTree('brock-look-cache-');
afterEach(() => tree.cleanup());

const PRODUCT = { id: 'cache-check', name: 'Cache check', appId: 'com.example.cache-check', author: { name: 'tester' } };

const appDir = () => {
  const root = tree.tempDir();
  tree.put(root, 'brock.config.ts', 'export default { product: { id: "cache-check" } };\n');
  tree.put(root, 'src/theme.css', ':root { --p-primary: #e8a33d; }\n');
  return root;
};

const later = (root, path, seconds) => {
  const at = new Date(Date.now() + seconds * 1000);
  utimesSync(join(root, path), at, at);
};

const counting = () => {
  const calls = [];
  const load = async (_rootDir, product) => {
    calls.push(product.name);
    return { config: product, look: { call: calls.length }, dark: null };
  };
  return { calls, load };
};

describe('the app look cache', () => {
  it('reads every file appLook reads: brock.config and the theme', () => {
    const root = appDir();
    expect(lookFiles(root, PRODUCT)).toEqual([join(root, 'brock.config.ts'), join(root, 'src', 'theme.css')]);
  });

  it('works the look out once for the splash page and the app page, even when both ask at the same time', async () => {
    const root = appDir();
    const { calls, load } = counting();
    const looks = appLookCache(root, PRODUCT, { load });
    const [splash, index] = await Promise.all([looks.get(), looks.get()]);
    expect(splash).toBe(index);
    await looks.get();
    expect(calls).toHaveLength(1);
  });

  it('works it out again once the theme changes', async () => {
    const root = appDir();
    const { calls, load } = counting();
    const looks = appLookCache(root, PRODUCT, { load });
    await looks.get();
    later(root, 'src/theme.css', 5);
    expect((await looks.get()).look).toEqual({ call: 2 });
    await looks.get();
    expect(calls).toHaveLength(2);
  });

  it('reads brock.config again once it changes, and uses its product', async () => {
    const root = appDir();
    const { calls, load } = counting();
    const reloads = [];
    const reload = async (rootDir, version) => {
      reloads.push(version);
      return { ...PRODUCT, name: 'Renamed' };
    };
    const looks = appLookCache(root, PRODUCT, { load, reload });
    await looks.get();
    later(root, 'brock.config.ts', 5);
    await looks.get();
    await looks.get();
    expect(calls).toEqual(['Cache check', 'Renamed']);
    expect(reloads).toHaveLength(1);
  });

  it('never keeps a failure, so the next request tries again', async () => {
    const root = appDir();
    let fail = true;
    const load = async () => {
      if (fail) throw new Error('theme.css is broken');
      return { config: PRODUCT, look: {}, dark: null };
    };
    const looks = appLookCache(root, PRODUCT, { load });
    await expect(looks.get()).rejects.toThrow(/broken/);
    fail = false;
    await expect(looks.get()).resolves.toMatchObject({ dark: null });
  });
});
