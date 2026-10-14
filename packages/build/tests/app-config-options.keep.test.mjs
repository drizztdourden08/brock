/* @layer tooling-scripts @kind test */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseAst } from 'vite';
import { afterEach, describe, expect, it } from 'vitest';
import { tempTree } from './temp-tree.mjs';
import { placeShim } from '../src/build-options/esm-shim-placement.mjs';
import { formatJson, withCompilerOptions } from '../src/build-options/tsconfig-compiler-options.mjs';
import { createBuilderConfig } from '../src/builder-config.mjs';
import { moduleTypeProblem } from '../src/managed/module-type-problem.mjs';
import { renderManagedFiles } from '../src/managed/templates.mjs';
import { createAfterPack } from '../src/packaging/after-pack.mjs';
import { appExtraResources, velopackIconOf } from '../src/packaging/app-packaging.mjs';
import { vpkPackArgs } from '../src/packaging/vpk-args.mjs';

const { tempDir, put, cleanup } = tempTree('brock-app-options-');
afterEach(cleanup);

const tsconfigOf = (opts) => renderManagedFiles(opts).find((file) => file.path === 'tsconfig.json').content;

const PRODUCT = {
  id: 'packs', appId: 'com.example.packs', name: 'Packs', author: { name: 'Someone' }, icons: {}, protocols: [],
  fileAssociations: [{ ext: 'pack', name: 'Pack', progId: 'Packs.Pack', icon: 'pack' }, { ext: 'note', name: 'Note', progId: 'Packs.Note' }],
};

describe('tsconfig.compilerOptions of brock.config.ts', () => {
  it('writes the managed tsconfig.json unchanged without any, in the same shape', () => {
    const plain = tsconfigOf();
    expect(tsconfigOf({ compilerOptions: {} })).toBe(plain);
    expect(withCompilerOptions(plain, undefined)).toBe(plain);
    expect(`${formatJson(JSON.parse(plain))}\n`).toBe(plain);
  });

  it('merges the app options key by key, and paths entry by entry beside the aliases', () => {
    const text = tsconfigOf({ aliases: { '@shared': '../shared' }, compilerOptions: { noUncheckedIndexedAccess: false, types: ['node'], paths: { '#data/*': ['./data/*'] } } });
    const tsconfig = JSON.parse(text);
    expect(tsconfig.compilerOptions.noUncheckedIndexedAccess).toBe(false);
    expect(tsconfig.compilerOptions.types).toEqual(['node']);
    expect(Object.keys(tsconfig.compilerOptions.paths)).toEqual(expect.arrayContaining(['@app/*', '@shared/*', 'react', '#data/*']));
    expect(tsconfig.include).toContain('.brock/*.ts');
    expect(text).toContain('    "types": ["node"],\n');
  });

  it('refuses compilerOptions that are not an object', () => {
    expect(() => tsconfigOf({ compilerOptions: ['strict'] })).toThrow(/brock\.config\.ts tsconfig\.compilerOptions must be an object/);
  });
});

describe('packaging of brock.config.ts', () => {
  it('gives a file association its role and icon, and its Windows registry icon follows', () => {
    const config = createBuilderConfig(PRODUCT, { rootDir: tempDir(), packaging: { fileAssociations: { note: { role: 'Viewer', icon: 'note' }, PACK: { role: 'Editor' } } } });
    expect(config.fileAssociations).toEqual([
      { ext: 'pack', name: 'Pack', mimeType: 'application/x-pack', icon: 'pack', role: 'Editor' },
      { ext: 'note', name: 'Note', mimeType: 'application/x-note', icon: 'note', role: 'Viewer' },
    ]);
    expect(config.win.extraResources).toEqual([{ from: 'build/pack.ico', to: 'file-icons/pack.ico' }, { from: 'build/note.ico', to: 'file-icons/note.ico' }]);
  });

  it('refuses an extension the product does not associate and a role electron-builder lacks', () => {
    expect(() => createBuilderConfig(PRODUCT, { rootDir: tempDir(), packaging: { fileAssociations: { zip: { role: 'Editor' } } } })).toThrow(/has no "zip" extension/);
    expect(() => createBuilderConfig(PRODUCT, { rootDir: tempDir(), packaging: { fileAssociations: { pack: { role: 'Owner' } } } })).toThrow(/role takes Editor, Viewer, Shell, None/);
  });

  it('copies the app extra resources from the app folder, and refuses an absolute path', () => {
    expect(appExtraResources([{ from: 'native\\addon.node', to: 'native/addon.node' }, { from: 'data', to: 'data', filter: ['**/*.bin'] }])).toEqual([
      { from: 'native/addon.node', to: 'native/addon.node' },
      { from: 'data', to: 'data', filter: ['**/*.bin'] },
    ]);
    expect(appExtraResources(undefined)).toEqual([]);
    expect(() => appExtraResources([{ from: join(tempDir(), 'x'), to: 'x' }])).toThrow(/extraResources\[0\]\.from is an absolute path/);
  });

  it('gives vpk the app icon of the platform, else the product one', () => {
    const icons = { windows: 'build/setup.ico', linux: 'build/setup.png' };
    expect(velopackIconOf(icons, 'win32')).toBe('build/setup.ico');
    expect(velopackIconOf(icons, 'darwin')).toBeNull();
    expect(velopackIconOf(undefined, 'linux')).toBeNull();
    const args = (icon) => vpkPackArgs({ product: { ...PRODUCT, icons: { ico: 'build/app.ico' } }, version: '1.0.0', platform: 'win32', packDir: 'p', outputDir: 'o', extras: { icon } });
    expect(args('build/setup.ico')).toEqual(expect.arrayContaining(['--icon', 'build/setup.ico']));
    expect(args(null)).toEqual(expect.arrayContaining(['--icon', 'build/app.ico']));
  });

  it('runs the app afterPack hook after Brock own, with the electron-builder context', async () => {
    const root = tempDir();
    put(root, 'build/after-pack.mjs', "import { writeFileSync } from 'node:fs';\nimport { join } from 'node:path';\nexport default async (context) => writeFileSync(join(context.appOutDir, 'hook.txt'), context.electronPlatformName);\n");
    const appOutDir = tempDir();
    const context = { appOutDir, electronPlatformName: 'linux', arch: 1, packager: { appInfo: { productFilename: 'Packs' } } };
    await createAfterPack(root, undefined, 'build/after-pack.mjs')(context);
    expect(readFileSync(join(appOutDir, 'hook.txt'), 'utf8')).toBe('linux');
    await expect(createAfterPack(root, undefined, 'build/missing.mjs')(context)).rejects.toThrow(/does not exist in the app folder/);
    expect(existsSync(join(root, 'build/missing.mjs'))).toBe(false);
  });
});

describe('the app package type', () => {
  it('asks for "type": "module", which the managed configs need for import.meta.dirname', () => {
    const app = tempDir();
    put(app, 'package.json', JSON.stringify({ name: 'app', type: 'module' }));
    expect(moduleTypeProblem(app)).toBeNull();
    put(app, 'package.json', JSON.stringify({ name: 'app' }));
    expect(moduleTypeProblem(app)).toMatch(/has no "type": "module".*import\.meta\.dirname/);
    expect(moduleTypeProblem(tempDir())).toBeNull();
  });
});

const SHIM = "\n// -- CommonJS Shims --\nimport __cjs_mod__ from 'node:module';\nconst __filename = import.meta.filename;\nconst __dirname = import.meta.dirname;\nconst require = __cjs_mod__.createRequire(import.meta.url);\n";

describe('the CommonJS shim of electron-vite', () => {
  it('moves the shim out of a template literal that holds an import line, after the last import', () => {
    const head = "import { join } from 'node:path';\nconst template = `import a from 'x';";
    const tail = "\nexport const b = 1;`;\nexport const at = join(__dirname, template);\n";
    const placed = placeShim(`${head}${SHIM}${tail}`, parseAst);
    expect(placed).toBe(`import { join } from 'node:path';${SHIM}\nconst template = \`import a from 'x';${tail}`);
    expect(() => parseAst(placed)).not.toThrow();
  });

  it('leaves a chunk alone when the shim is already a statement, or there is none', () => {
    const good = `import { join } from 'node:path';${SHIM}export const at = join(__dirname, 'x');\n`;
    expect(placeShim(good, parseAst)).toBeNull();
    expect(placeShim("export const a = 'no shim';\n", parseAst)).toBeNull();
  });
});
