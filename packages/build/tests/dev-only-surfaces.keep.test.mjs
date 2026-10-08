/* @layer tooling-scripts @kind test */
import { existsSync, readFileSync, readdirSync, rmSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';
import { build } from 'vite';
import { afterEach, describe, expect, it } from 'vitest';
import { tempTree } from './temp-tree.mjs';
import { devOnlyPlugin } from '../src/dev-only/dev-only-plugin.mjs';
import { devRegistryStub } from '../src/dev-only/dev-registry-stub.mjs';
import { renderHandlersFiles } from '../src/handlers/render-handlers.mjs';
import { renderScreensFiles } from '../src/screens/render-screens.mjs';
import { scanScreens } from '../src/screens/scan-screens.mjs';
import { writeChanged } from '../src/write-changed.mjs';

const { tempDir, put, cleanup } = tempTree('brock-dev-only-');

afterEach(cleanup);

const SCREENS_CONFIG = "export default { buckets: [{ id: 'tools', title: 'Tools', icon: 'wrench', menu: 'entry' }], home: 'tools' };\n";
const component = (mark) => `export const meta = { title: '${mark}' };\nconst Screen = () => '${mark}';\nexport default Screen;\n`;

const app = () => {
  const root = tempDir();
  put(root, 'src/screens/screens.config.ts', SCREENS_CONFIG);
  put(root, 'src/screens/tools/status.page.tsx', component('PROD-STATUS-MARK'));
  put(root, 'src/screens/tools/inspector.page.dev.tsx', component('DEV-INSPECTOR-MARK'));
  put(root, 'src/screens/editor.card.dev.tsx', component('DEV-EDITOR-MARK'));
  put(root, 'electron/handlers/engine-handlers.ts', "const engineHandlers = { id: 'engine', register: () => 'PROD-ENGINE-MARK' };\nexport { engineHandlers };\n");
  put(root, 'electron/handlers/dataset-handlers.dev.ts', "const datasetHandlers = { id: 'dataset', register: () => 'DEV-DATASET-MARK' };\nexport { datasetHandlers };\n");
  return root;
};

const contentOf = (files, path) => files.find((file) => file.path === path)?.content;

describe('dev-only screens', () => {
  it('reads .dev before the extension as a dev-only screen of the same kind', () => {
    const { files, findings } = scanScreens(app());
    expect(findings).toEqual([]);
    expect(files.map(({ kind, id, dev }) => [kind, id, dev ?? false])).toEqual([
      ['card', 'editor', true], ['page', 'inspector', true], ['page', 'status', false],
    ]);
  });

  it('keeps them out of .brock/screens.ts and .brock/search.ts, which spread the lists of .brock/screens.dev.ts', () => {
    const files = renderScreensFiles(app());
    const screens = contentOf(files, '.brock/screens.ts');
    expect(screens).toContain("import { devScreens } from './screens.dev';");
    expect(screens).toContain('  ...devScreens,');
    expect(screens).not.toContain('inspector');
    expect(contentOf(files, '.brock/search.ts')).toContain("import { devSearchSeeds } from './screens.dev';");
    expect(contentOf(files, '.brock/search.ts')).not.toContain('inspector');
    const dev = contentOf(files, '.brock/screens.dev.ts');
    expect(dev).toContain("import ToolsInspectorPage, { meta as toolsInspectorPageMeta } from '../src/screens/tools/inspector.page.dev';");
    expect(dev).toContain("{ kind: 'page', bucket: 'tools', id: 'inspector', component: ToolsInspectorPage, meta: toolsInspectorPageMeta },");
    expect(dev).toContain("{ kind: 'card', id: 'editor', component: EditorCard, meta: editorCardMeta },");
    expect(dev).toContain('"title":"DEV-INSPECTOR-MARK"');
    expect(dev).toContain('export { devScreens, devSearchSeeds };');
  });

  it('writes the same files as before for an app with no dev-only screen, and removes a stale screens.dev.ts', () => {
    const root = app();
    writeChanged(root, renderScreensFiles(root));
    expect(existsSync(join(root, '.brock/screens.dev.ts'))).toBe(true);
    rmSync(join(root, 'src/screens/tools/inspector.page.dev.tsx'));
    rmSync(join(root, 'src/screens/editor.card.dev.tsx'));
    const files = renderScreensFiles(root);
    expect(contentOf(files, '.brock/screens.dev.ts')).toBeNull();
    expect(contentOf(files, '.brock/screens.ts')).not.toContain('screens.dev');
    expect(writeChanged(root, files)).toContain('.brock/screens.dev.ts');
    expect(existsSync(join(root, '.brock/screens.dev.ts'))).toBe(false);
  });

  it('reports what a production build would break, and a kind that cannot be dev-only', () => {
    const root = tempDir();
    put(root, 'src/screens/screens.config.ts', SCREENS_CONFIG);
    put(root, 'src/screens/tools/inspector.page.dev.tsx', component('A'));
    put(root, 'src/screens/tools/inspector/detail.sub.tsx', component('B'));
    put(root, 'src/screens/tools/home.hero.dev.tsx', component('C'));
    put(root, 'src/screens/lab/probe.page.dev.tsx', component('D'));
    const { findings } = scanScreens(root);
    expect(findings).toEqual([
      'src/screens/tools/home.hero.dev.tsx: a hero cannot be dev-only; .dev goes on a page, tab, sub-page, settings page, custom page, card or layer',
      expect.stringMatching(/^src\/screens\/lab: every screen of this bucket is dev-only/),
      expect.stringMatching(/^src\/screens\/tools\/inspector\/detail\.sub\.tsx: its page "inspector" is dev-only/),
    ]);
  });
});

describe('dev-only handler groups', () => {
  it('lists <subject>-handlers.dev.ts in .brock/handlers.main.dev.ts, spread into mainHandlers', () => {
    const files = renderHandlersFiles(app());
    expect(contentOf(files, '.brock/handlers.main.ts')).toContain("import { devHandlers } from './handlers.main.dev';");
    expect(contentOf(files, '.brock/handlers.main.ts')).toContain('const mainHandlers: HandlerGroup[] = [engineHandlers, ...devHandlers];');
    expect(contentOf(files, '.brock/handlers.main.dev.ts')).toContain("import { datasetHandlers } from '../electron/handlers/dataset-handlers.dev';");
    expect(contentOf(files, '.brock/handlers.main.dev.ts')).toContain('const devHandlers: HandlerGroup[] = [datasetHandlers];');
    expect(contentOf(renderHandlersFiles(tempDir()), '.brock/handlers.main.dev.ts')).toBeNull();
  });

  it('stubs a dev registry as the same exports, each an empty list', () => {
    expect(devRegistryStub('import x from "y";\nconst devScreens = [x];\nconst devSearchSeeds = [];\nexport { devScreens, devSearchSeeds };\nexport type { Y };\n'))
      .toBe('const devScreens = [];\nconst devSearchSeeds = [];\nexport { devScreens, devSearchSeeds };\n');
  });
});

const bundle = async (root, entry, mode) => {
  const outDir = join(root, `out-${mode}`);
  await build({
    root,
    mode,
    logLevel: 'silent',
    configFile: false,
    plugins: [devOnlyPlugin({ rootDir: root })],
    build: { outDir, emptyOutDir: true, minify: false, lib: { entry: join(root, entry), formats: ['es'], fileName: 'out' }, rollupOptions: { external: [/^@drizztdourden08\//] } },
  });
  return readdirSync(outDir).map((file) => readFileSync(join(outDir, file), 'utf8')).join('\n');
};

const DEV_MARKS = ['DEV-INSPECTOR-MARK', 'DEV-EDITOR-MARK', 'DEV-DATASET-MARK', 'inspector.page.dev'];
const DIRECT_IMPORT = "import Inspector from './src/screens/tools/inspector.page.dev';\nexport { Inspector };\n";
const DEV_ONLY_STOP = /inspector\.page\.dev\.tsx is dev-only/;

const syncedApp = () => {
  const root = app();
  writeChanged(root, [...renderScreensFiles(root), ...renderHandlersFiles(root)]);
  put(root, 'entry.ts', "import { screenTree } from './.brock/screens';\nimport { mainHandlers } from './.brock/handlers.main';\nexport { screenTree, mainHandlers };\n");
  put(root, 'direct.ts', DIRECT_IMPORT);
  return root;
};

const linkTo = (target) => {
  const link = join(tempDir(), 'app');
  symlinkSync(target, link, 'junction');
  return link;
};

describe('a production build', () => {
  it('has none of the dev-only screens or handler groups, and a development build has them all', async () => {
    const root = syncedApp();
    const production = await bundle(root, 'entry.ts', 'production');
    expect(production).toContain('PROD-STATUS-MARK');
    expect(production).toContain('PROD-ENGINE-MARK');
    for (const mark of DEV_MARKS) expect(production).not.toContain(mark);
    const development = await bundle(root, 'entry.ts', 'development');
    for (const mark of ['DEV-INSPECTOR-MARK', 'DEV-EDITOR-MARK', 'DEV-DATASET-MARK', 'PROD-STATUS-MARK']) expect(development).toContain(mark);
  });

  it('stops when shipped code imports a dev-only file itself', async () => {
    await expect(bundle(syncedApp(), 'direct.ts', 'production')).rejects.toThrow(DEV_ONLY_STOP);
  });

  it('does both when the app root is a link or a short name, which Vite resolves to the real path', async () => {
    const root = linkTo(syncedApp());
    const production = await bundle(root, 'entry.ts', 'production');
    expect(production).toContain('PROD-STATUS-MARK');
    for (const mark of DEV_MARKS) expect(production).not.toContain(mark);
    await expect(bundle(root, 'direct.ts', 'production')).rejects.toThrow(DEV_ONLY_STOP);
  });
});
