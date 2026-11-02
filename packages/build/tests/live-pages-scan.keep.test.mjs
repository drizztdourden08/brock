/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { tempTree } from './temp-tree.mjs';
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

describe('K1 a .live.tsx file', { tags: ['critical'] }, () => {
  it('is a live page of its bucket', () => {
    const { files, findings } = scanScreens(app());
    expect(findings).toEqual([]);
    expect(files.map(({ kind, id, bucket }) => [kind, id, bucket])).toEqual([['page', 'directory', 'controllers'], ['live', 'pads', 'controllers']]);
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
