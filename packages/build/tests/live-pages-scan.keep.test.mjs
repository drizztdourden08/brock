/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { tempTree } from './temp-tree.mjs';
import { renderScreensFiles } from '../src/screens/render-screens.mjs';
import { scanScreens } from '../src/screens/scan-screens.mjs';

const { tempDir, put, cleanup } = tempTree('brock-live-pages-');

afterEach(cleanup);

const CONFIG = "export default { buckets: [{ id: 'controllers', title: 'Controllers', icon: 'gamepad-2', menu: 'entry' }], home: 'controllers' };\n";
const PAGE = 'const Page = () => null;\nexport default Page;\n';
const LIVE = [
  "const meta = { icon: 'gamepad-2', empty: 'No controller connected', order: 2, keywords: ['Gamepad'] };",
  'const usePads = () => [];',
  'export default usePads;',
  'export { meta };',
  '',
].join('\n');

const app = (live = LIVE) => {
  const root = tempDir();
  put(root, 'src/screens/screens.config.ts', CONFIG);
  put(root, 'src/screens/controllers/directory.page.tsx', PAGE);
  put(root, 'src/screens/controllers/pads.live.tsx', live);
  return root;
};

describe('a .live.tsx file', () => {
  it('is a live page of its bucket', () => {
    const { files, findings } = scanScreens(app());
    expect(findings).toEqual([]);
    expect(files.map(({ kind, id, bucket }) => [kind, id, bucket])).toEqual([['page', 'directory', 'controllers'], ['live', 'pads', 'controllers']]);
  });

  it('is imported at boot and hands its hook to the tree as usePages', () => {
    const screens = renderScreensFiles(app()).find((file) => file.path === '.brock/screens.ts')?.content;
    expect(screens).toContain("import ControllersPadsLive, { meta as controllersPadsLiveMeta } from '../src/screens/controllers/pads.live';");
    expect(screens).toContain("{ kind: 'live', bucket: 'controllers', id: 'pads', usePages: ControllersPadsLive, meta: controllersPadsLiveMeta },");
  });

  it('feeds the search seed with its title, icon and keywords', () => {
    const search = renderScreensFiles(app()).find((file) => file.path === '.brock/search.ts')?.content;
    expect(search).toContain('"kind":"live","id":"pads","bucket":"controllers"');
    expect(search).toContain('"icon":"gamepad-2"');
    expect(search).toContain('"keywords":["gamepad"]');
  });

  it('needs a meta export', () => {
    const { findings } = scanScreens(app('const usePads = () => [];\nexport default usePads;\n'));
    expect(findings).toEqual([expect.stringContaining('pads.live.tsx: a live page exports meta: LiveMeta')]);
  });

  it('cannot sit in a page folder', () => {
    const root = app();
    put(root, 'src/screens/controllers/directory/extra.live.tsx', LIVE);
    put(root, 'src/screens/controllers/directory/main.tab.tsx', PAGE);
    expect(scanScreens(root).findings.join('\n')).toContain('a page folder holds only');
  });
});
