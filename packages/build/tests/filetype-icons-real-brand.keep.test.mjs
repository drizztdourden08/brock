/* @layer tooling-scripts @kind test */
import { existsSync, mkdirSync, readdirSync, statSync, symlinkSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { FILETYPE_SIZES } from '../src/icons/brand-files.mjs';
import { copyBrandIcons } from '../src/icons/copy-brand-icons.mjs';
import { removeTempRepos, tempRepo } from './temp-repo.mjs';

afterEach(removeTempRepos);

const TESSERA = resolve(import.meta.dirname, '../../../node_modules/@drizztdourden08/tessera');
const REAL_TYPES = join(TESSERA, 'brand', 'bxel', 'filetypes');
const EXTENSIONS = readdirSync(REAL_TYPES).filter((entry) => statSync(join(REAL_TYPES, entry)).isDirectory());

const appWithRealTessera = () => {
  const root = tempRepo({ 'package.json': '{"name":"app"}' });
  mkdirSync(join(root, 'node_modules', '@drizztdourden08'), { recursive: true });
  symlinkSync(TESSERA, join(root, 'node_modules', '@drizztdourden08', 'tessera'), 'junction');
  return root;
};

const productOf = (icons) => ({
  id: 'bxel',
  name: 'Bxel',
  appId: 'com.example.bxel',
  author: { name: 'someone' },
  icons,
  fileAssociations: EXTENSIONS.map((ext) => ({ ext, name: `Bxel ${ext}`, progId: `Bxel.${ext}` })),
});

const generated = (ext) => [
  `build/filetypes/${ext}.ico`,
  `build/filetypes/${ext}.icns`,
  ...FILETYPE_SIZES.map((size) => `build/filetypes/linux/${ext}/${size}x${size}.png`),
];

describe('the installed Tessera bxel file type icons', () => {
  it('ships one folder per Bxel extension with an ico, an icns, an svg and the sizes Brock copies', () => {
    expect(EXTENSIONS.length).toBeGreaterThan(0);
    for (const ext of EXTENSIONS) {
      const folder = join(REAL_TYPES, ext);
      expect(existsSync(join(folder, 'icon.ico'))).toBe(true);
      expect(existsSync(join(folder, 'icon.icns'))).toBe(true);
      expect(existsSync(join(folder, 'icon.svg'))).toBe(true);
      for (const size of FILETYPE_SIZES) expect(existsSync(join(folder, 'png', `icon-${size}.png`))).toBe(true);
    }
  });

  it.each([
    ['the plain brand', { brand: 'bxel' }],
    ['the light rim, which has no filetypes folder', { brand: 'bxel', rim: 'light' }],
  ])('generates every type under build/filetypes from %s and never copies the svg', (_label, icons) => {
    const root = appWithRealTessera();
    const result = copyBrandIcons(root, { product: productOf(icons) });
    for (const ext of EXTENSIONS) {
      for (const file of generated(ext)) {
        expect(existsSync(join(root, file)), file).toBe(true);
        expect(result?.written).toContain(file);
      }
    }
    const everything = [...(result?.written ?? []), ...(result?.current ?? [])];
    expect(everything.filter((file) => file.startsWith('build/filetypes/') && file.endsWith('.svg'))).toEqual([]);
  });
});
