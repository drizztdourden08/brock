/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { scanScreens } from '../src/screens/scan-screens.mjs';
import { renderSearch } from '../src/screens/search/render-search.mjs';
import { renderScreens } from '../src/screens/render-screens.mjs';
import { checkScreens } from '../src/screens/check-screens.mjs';
import { tmpdir } from 'node:os';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const CONFIG = `import { defineScreens } from '@drizztdourden08/brock-react';

export default defineScreens({
  buckets: [{ id: 'multiworld', title: 'Multiworld', icon: 'layers', menu: 'entry', groups: [{ id: 'library', label: 'Library' }] }],
  home: 'multiworld',
});
`;

const PAGE = 'const Page = () => null;\n\nexport default Page;\n';
const SUB = (title, path) => `const meta = { title: '${title}'${path ? `, path: '${path}'` : ''} };\nconst Sub = () => null;\n\nexport default Sub;\nexport { meta };\n`;

const roots = [];

const put = (root, path, content) => {
  const full = join(root, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
};

const appWith = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-kinds-'));
  roots.push(root);
  put(root, 'src/screens/screens.config.ts', CONFIG);
  Object.entries(files).forEach(([path, content]) => put(root, path, content));
  return root;
};

const VALID = {
  'src/screens/multiworld/home.hero.tsx': PAGE,
  'src/screens/multiworld/library/sessions.page.tsx': PAGE,
  'src/screens/multiworld/library/sessions/new.sub.tsx': SUB('New session'),
  'src/screens/multiworld/library/sessions/edit.sub.tsx': SUB('Edit session', ':id/edit'),
  'src/screens/session.base.tsx': SUB('Session'),
};

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('base and sub-page files', () => {
  it('reads a base screen at the root and sub-pages in the folder of their page', async () => {
    const root = appWith(VALID);
    const { files, findings } = scanScreens(root);
    expect(findings).toEqual([]);
    expect(await checkScreens(root)).toEqual([]);
    expect(files.filter((file) => file.kind === 'sub').map((file) => [file.group, file.page, file.id])).toEqual([['library', 'sessions', 'edit'], ['library', 'sessions', 'new']]);
    expect(files.find((file) => file.kind === 'base')?.id).toBe('session');
  });

  it('lists them in .brock/screens.ts', () => {
    const out = renderScreens(scanScreens(appWith(VALID)).files);
    expect(out).toContain("{ kind: 'sub', bucket: 'multiworld', group: 'library', page: 'sessions', id: 'edit', component: MultiworldLibrarySessionsEditSub, meta: multiworldLibrarySessionsEditSubMeta },");
    expect(out).toContain("{ kind: 'base', id: 'session', component: SessionBase, meta: sessionBaseMeta },");
  });

  it('seeds search with the sub-page path', () => {
    const root = appWith(VALID);
    const out = renderSearch(root, scanScreens(root).files);
    expect(out).toContain('"kind":"sub","id":"edit","bucket":"multiworld","group":"library","page":"sessions","title":"Edit session","path":":id/edit"');
    expect(out).toContain('"kind":"base","id":"session","title":"Session"');
  });

  it('rejects two base screens, a base inside a bucket, a base named like a bucket and a sub-page with no page', () => {
    const { findings } = scanScreens(appWith({
      ...VALID,
      'src/screens/multiworld.base.tsx': PAGE,
      'src/screens/multiworld/game.base.tsx': PAGE,
      'src/screens/multiworld/library/presets/edit.sub.tsx': PAGE,
    }));
    expect(findings).toEqual([
      'src/screens/multiworld/game.base.tsx: the base screen sits at the root of src/screens: src/screens/<id>.base.tsx',
      'src/screens/multiworld/library/presets/edit.sub.tsx: no page "presets" for this sub-page; add presets.page.tsx beside the presets/ folder, or tabs inside it',
      'src/screens: 2 base screens (multiworld.base.tsx, session.base.tsx); an app has one .base.tsx',
      'src/screens/multiworld.base.tsx: "multiworld" is also a bucket or a screen; give the base screen an id of its own',
    ]);
  });
});
