/* @layer tooling-scripts @kind test */
import { rmSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { brandIconsCurrent, writeBrandRecord } from '../src/freshness/brand-icons-record.mjs';
import { tempTree } from './temp-tree.mjs';

const { tempDir, put, cleanup } = tempTree('brock-brand-record-');

afterEach(cleanup);

const appWithBrand = () => {
  const root = tempDir();
  const brandDir = tempDir();
  put(root, 'package.json', '{"name":"app"}');
  put(root, 'brock.config.ts', 'export default {};');
  put(root, 'build/icon.png', 'png');
  put(brandDir, 'icon.svg', '<svg/>');
  return { root, brandDir, copied: { brandDir, written: ['build/icon.png'], current: [] } };
};

describe('brandIconsCurrent', () => {
  it('is false before any copy is recorded', () => {
    expect(brandIconsCurrent(appWithBrand().root)).toBe(false);
  });

  it('is true after a copy until the config, the brand files or an output change', () => {
    const { root, brandDir, copied } = appWithBrand();
    writeBrandRecord(root, copied);
    expect(brandIconsCurrent(root)).toBe(true);
    put(brandDir, 'icon-dark.svg', '<svg/>');
    expect(brandIconsCurrent(root)).toBe(false);
    writeBrandRecord(root, copied);
    put(root, 'build/icon.png', 'changed png');
    expect(brandIconsCurrent(root)).toBe(false);
    writeBrandRecord(root, copied);
    put(root, 'brock.config.ts', 'export default { product: {} };');
    expect(brandIconsCurrent(root)).toBe(false);
  });

  it('is false when an output was removed', () => {
    const { root, copied } = appWithBrand();
    writeBrandRecord(root, copied);
    rmSync(join(root, 'build/icon.png'));
    expect(brandIconsCurrent(root)).toBe(false);
  });

  it('holds for an app with no brand once the config and install are unchanged', () => {
    const { root } = appWithBrand();
    writeBrandRecord(root, null);
    expect(brandIconsCurrent(root)).toBe(true);
    put(root, 'package.json', '{"name":"app","version":"2"}');
    expect(brandIconsCurrent(root)).toBe(false);
  });
});
