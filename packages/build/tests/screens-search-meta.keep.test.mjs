/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { checkScreens } from '../src/screens/check-screens.mjs';
import { scanScreens } from '../src/screens/scan-screens.mjs';
import { renderSearch } from '../src/screens/search/render-search.mjs';
import { tempTree } from './temp-tree.mjs';

const tree = tempTree('brock-search-meta-');
afterEach(tree.cleanup);

const CONFIG = "import { defineScreens } from '@drizztdourden08/brock-react';\n\nexport default defineScreens({ buckets: [{ id: 'game', title: 'Game', icon: 'gamepad-2', menu: 'entry' }], home: 'game' });\n";
const HERO = 'const Hero = () => null;\n\nexport default Hero;\n';

const pageWith = (meta, head = '') => `${head}const meta = ${meta};\nconst Page = () => null;\n\nexport default Page;\nexport { meta };\n`;

const appWith = (page) => {
  const root = tree.tempDir();
  tree.put(root, 'src/screens/screens.config.ts', CONFIG);
  tree.put(root, 'src/screens/game/home.hero.tsx', HERO);
  tree.put(root, 'src/screens/game/engine.page.tsx', page);
  return root;
};

describe('page meta in search', () => {
  it('reads the keywords and searchRows of a page meta into its seed', async () => {
    const root = appWith(pageWith("{ title: 'Engine', keywords: ['version'], searchRows: [{ label: 'Build', keywords: ['patch'], anchor: 'build' }] }"));
    expect(await checkScreens(root)).toEqual([]);
    const out = renderSearch(root, scanScreens(root).files);
    expect(out).toContain('"keywords":["version"]');
    expect(out).toContain('"entries":[{"label":"Build","keywords":["patch"],"anchor":"build"}]');
  });

  it('flags keywords and searchRows the build cannot read as literals', async () => {
    const root = appWith(pageWith("{ title: 'Engine', keywords: WORDS, searchRows: ROWS }", "import { WORDS } from './words';\n"));
    const findings = await checkScreens(root);
    expect(findings.map((finding) => finding.split(': ')[1]?.split(' ')[0])).toEqual(['meta.keywords', 'meta.searchRows']);
  });
});
