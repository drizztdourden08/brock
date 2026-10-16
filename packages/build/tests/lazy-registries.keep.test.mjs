/* @layer tooling-scripts @kind test */
import { createRequire } from 'node:module';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { build } from 'vite';
import { afterEach, describe, expect, it } from 'vitest';
import { tempTree } from './temp-tree.mjs';
import { metaModulesPlugin } from '../src/meta-modules/meta-modules-plugin.mjs';
import { rewriteMetaImports } from '../src/meta-modules/rewrite-meta-imports.mjs';
import { stripToExports } from '../src/meta-modules/strip-to-exports.mjs';
import { renderScreensFiles } from '../src/screens/render-screens.mjs';
import { renderTitleBarFiles } from '../src/title-bar/render-title-bar.mjs';
import { renderWidgetsFiles } from '../src/widgets/render-widgets.mjs';
import { writeChanged } from '../src/write-changed.mjs';

const ts = createRequire(import.meta.url)('typescript');
const { tempDir, put, cleanup } = tempTree('brock-lazy-');

afterEach(cleanup);

const strip = (source, fileName = 'x.page.tsx') => stripToExports(ts, fileName, source, ['meta', 'order']);

const PAGE = [
  "import { heavy } from './heavy';",
  "import { Badge, iconOf } from './parts';",
  "import type { ScreenMeta } from '@drizztdourden08/brock-react';",
  "import './page.css';",
  '',
  "const TITLE = 'Saves';",
  'const meta: ScreenMeta = { title: TITLE, icon: iconOf(\'save\'), when: ({ flags }) => flags.on === true };',
  '',
  'registerSomething(heavy);',
  '',
  'const SavesPage = () => <Badge>{heavy()}</Badge>;',
  '',
  'export default SavesPage;',
  'export { meta };',
  '',
].join('\n');

describe('stripToExports', () => {
  it('keeps meta and what it uses, and leaves out the component, its imports and side effects', () => {
    const out = strip(PAGE);
    expect(out?.exports).toEqual(['meta']);
    expect(out?.code).toBe([
      "import { iconOf } from './parts';",
      "const TITLE = 'Saves';",
      "const meta: ScreenMeta = { title: TITLE, icon: iconOf('save'), when: ({ flags }) => flags.on === true };",
      'export { meta };',
      '',
    ].join('\n'));
  });

  it('keeps an exported const meta and an order, and the JSX factory a meta with JSX needs', () => {
    const out = strip([
      "import React from 'react';",
      "import { Art } from './art';",
      "import { Page } from './page';",
      'export const order = 2;',
      'export const meta = { backdrop: { kind: \'node\', node: <Art /> } };',
      'export default function Screen() { return <Page />; }',
      '',
    ].join('\n'));
    expect(out?.exports).toEqual(['order', 'meta']);
    expect(out?.code).toContain("import React from 'react';");
    expect(out?.code).toContain("import { Art } from './art';");
    expect(out?.code).not.toContain('./page');
    expect(out?.code).not.toContain('Screen');
  });

  it('gives up when meta reaches the default-exported component, or there is no meta', () => {
    expect(strip('export default function Screen() { return null; }\nexport const meta = { title: Screen.name };\n')).toBeNull();
    expect(strip('const Screen = () => null;\nexport default Screen;\n')).toBeNull();
    expect(strip('export const meta = {;\n')).toBeNull();
  });

  it('follows helpers, classes and enums meta reads, and keeps names used only as types out', () => {
    const out = strip([
      "import { Store } from './store';",
      "import { Shape } from './shape';",
      'enum Kind { A, B }',
      'function label(kind: Kind): string { return Kind[kind] ?? Store.fallback; }',
      'const meta = { title: label(Kind.A) } satisfies Shape;',
      'export { meta };',
      '',
    ].join('\n'), 'x.page.ts');
    expect(out?.code).toContain("import { Store } from './store';");
    expect(out?.code).not.toContain('./shape');
    expect(out?.code).toContain('enum Kind');
    expect(out?.code).toContain('function label');
  });
});

describe('rewriteMetaImports', () => {
  it('points an import of only meta or order at the file meta module and leaves the rest', () => {
    const code = [
      "import { meta as savesMeta } from '../src/screens/saves.page';",
      "import { order as roomsOrder } from '../src/title-bar/rooms.action';",
      "import Display, { meta as displayMeta } from '../src/screens/display.settings';",
      "import { searchIndex } from './search';",
    ].join('\n');
    expect(rewriteMetaImports(code)).toBe([
      "import { meta as savesMeta } from '../src/screens/saves.page?brock-meta';",
      "import { order as roomsOrder } from '../src/title-bar/rooms.action?brock-meta';",
      "import Display, { meta as displayMeta } from '../src/screens/display.settings';",
      "import { searchIndex } from './search';",
    ].join('\n'));
  });
});

describe('title bar items', () => {
  it('loads a button the build can read on its first click, and keeps a hook or a computed label eager', () => {
    const root = tempDir();
    put(root, 'src/title-bar/export.action.ts', "export const order = 1;\nexport default defineTitleBarItem({ kind: 'button', label: 'Export', icon: 'download', shortcut: 'Mod+E', onSelect: () => runExport() });\n");
    put(root, 'src/title-bar/status.action.ts', 'const useStatus = () => null;\nexport default useStatus;\n');
    put(root, 'src/title-bar/named.action.ts', "export default defineTitleBarItem({ kind: 'button', label: LABEL, icon: 'x', onSelect: () => {} });\n");
    const out = renderTitleBarFiles(root)[0]?.content ?? '';
    expect(out).toContain("import { lazyTitleBarButton, titleBarFromFiles } from '@drizztdourden08/brock-react';");
    expect(out).toContain("import { order as exportOrder } from '../src/title-bar/export.action';");
    expect(out).toContain(`{ id: 'export', source: lazyTitleBarButton({"kind":"button","label":"Export","icon":"download","shortcut":"Mod+E"}, () => import('../src/title-bar/export.action')), order: exportOrder },`);
    expect(out).toContain("import statusItem from '../src/title-bar/status.action';");
    expect(out).toContain("import namedItem from '../src/title-bar/named.action';");
  });
});

const SCREENS_CONFIG = "export default { buckets: [{ id: 'tools', title: 'Tools', icon: 'wrench', menu: 'entry' }], home: 'tools' };\n";

const lazyApp = () => {
  const root = tempDir();
  put(root, 'src/screens/screens.config.ts', SCREENS_CONFIG);
  put(root, 'src/screens/tools/status.page.tsx', [
    "import { heavyPart } from '../../heavy';",
    "const meta = { title: 'META-STATUS-MARK' };",
    'const StatusPage = () => heavyPart();',
    'export default StatusPage;',
    'export { meta };',
    '',
  ].join('\n'));
  put(root, 'src/heavy.ts', "const heavyPart = () => 'COMPONENT-HEAVY-MARK';\nexport { heavyPart };\n");
  put(root, 'src/widgets/notes.widget.tsx', "const meta = { label: 'META-NOTES-MARK' };\nconst Notes = () => 'COMPONENT-NOTES-MARK';\nexport default Notes;\nexport { meta };\n");
  writeChanged(root, [...renderScreensFiles(root), ...renderWidgetsFiles(root)]);
  put(root, 'entry.ts', "import { screenTree } from './.brock/screens';\nimport { appWidgets } from './.brock/widgets';\nexport { screenTree, appWidgets };\n");
  return root;
};

const bundle = async (root) => {
  const outDir = join(root, 'out');
  await build({
    root,
    logLevel: 'silent',
    configFile: false,
    plugins: [metaModulesPlugin({ rootDir: root })],
    build: { outDir, emptyOutDir: true, minify: false, lib: { entry: join(root, 'entry.ts'), formats: ['es'], fileName: 'entry' }, rollupOptions: { external: [/^@drizztdourden08\//] } },
  });
  return Object.fromEntries(readdirSync(outDir).map((file) => [file, readFileSync(join(outDir, file), 'utf8')]));
};

describe('a build of the lazy registries', () => {
  it('puts each meta in the entry chunk and each component in a chunk of its own', async () => {
    const chunks = await bundle(lazyApp());
    const [entryFile = '', entry = ''] = Object.entries(chunks).find(([file]) => file.startsWith('entry.')) ?? [];
    expect(entry).toContain('META-STATUS-MARK');
    expect(entry).toContain('META-NOTES-MARK');
    expect(entry).not.toContain('COMPONENT-HEAVY-MARK');
    expect(entry).not.toContain('COMPONENT-NOTES-MARK');
    const others = Object.entries(chunks).filter(([file]) => file !== entryFile).map(([, code]) => code).join('\n');
    expect(others).toContain('COMPONENT-HEAVY-MARK');
    expect(others).toContain('COMPONENT-NOTES-MARK');
  });
});
