/* @layer tooling-scripts @kind test */
import { join } from 'node:path';
import ts from 'typescript';
import { afterEach, describe, expect, it } from 'vitest';
import { renderTesseraEntry, renderTesseraEntryFiles } from '../src/tessera/render-tessera-entry.mjs';
import { tempTree } from './temp-tree.mjs';

const { tempDir, put, cleanup } = tempTree('brock-tessera-entry-');

afterEach(cleanup);

const TESSERA = '@drizztdourden08/tessera';

const PARTS_MODULE = [
  '/* @layer renderer-app @kind types */',
  `declare module '${TESSERA}' {`,
  '  interface TesseraApps {',
  "    'demo-app': {",
  '      parts:',
  "        | 'SaveSlot';",
  '    };',
  '  }',
  '}',
  '',
  'export {};',
  '',
].join('\n');

const putTessera = (root, dir) => {
  put(root, `${dir}/package.json`, JSON.stringify({ name: TESSERA, version: '0.30.0', exports: { '.': './src/index.ts', './primitives': './src/primitives/index.ts' } }));
  put(root, `${dir}/src/index.ts`, 'export interface TesseraApps {}\nexport type AppPart = TesseraApps[keyof TesseraApps];\n');
  put(root, `${dir}/src/primitives/index.ts`, 'export const box = 1;\n');
};

const linkedApp = () => {
  const root = tempDir();
  putTessera(root, `app/node_modules/${TESSERA}`);
  putTessera(root, `brock/node_modules/${TESSERA}`);
  put(root, 'brock/src/index.ts', `export type { TesseraApps } from '${TESSERA}';\nexport { box } from '${TESSERA}/primitives';\n`);
  put(root, 'app/package.json', JSON.stringify({ name: 'demo-app', dependencies: { [TESSERA]: '^0.30.0' } }));
  put(root, 'app/src/main.ts', `import { box } from '${TESSERA}/primitives';\nimport { box as linked } from '../../brock/src/index';\n\nexport const total = box + linked;\n`);
  put(root, 'app/.brock/tessera-parts.ts', PARTS_MODULE);
  return join(root, 'app');
};

const diagnosticCodes = (appDir, files) => {
  const program = ts.createProgram(files.map((file) => join(appDir, file)), {
    module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, target: ts.ScriptTarget.ES2022, strict: true, noEmit: true, skipLibCheck: true, types: [],
  });
  return ts.getPreEmitDiagnostics(program).map((diagnostic) => diagnostic.code);
};

describe('.brock/tessera.ts', () => {
  it('imports the Tessera entry module while the app has Tessera, and is removed without it', () => {
    const app = tempDir();
    put(app, 'package.json', JSON.stringify({ dependencies: { [TESSERA]: '^0.30.0' } }));
    expect(renderTesseraEntryFiles(app)).toEqual([{ path: '.brock/tessera.ts', content: renderTesseraEntry() }]);
    expect(renderTesseraEntry()).toContain(`import type {} from '${TESSERA}';`);
    const bare = tempDir();
    put(bare, 'package.json', JSON.stringify({ dependencies: {} }));
    expect(renderTesseraEntryFiles(bare)).toEqual([{ path: '.brock/tessera.ts', content: null }]);
  });

  it('lets the tessera guide parts module resolve when only a linked Brock copy imports the Tessera entry', { timeout: 60_000 }, () => {
    const appDir = linkedApp();
    expect(diagnosticCodes(appDir, ['src/main.ts', '.brock/tessera-parts.ts'])).toContain(2664);
    put(appDir, '.brock/tessera.ts', renderTesseraEntry());
    expect(diagnosticCodes(appDir, ['src/main.ts', '.brock/tessera-parts.ts', '.brock/tessera.ts'])).toEqual([]);
  });
});
