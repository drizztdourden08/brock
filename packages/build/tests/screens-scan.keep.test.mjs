/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { checkScreens } from '../src/screens/check-screens.mjs';
import { renderScreens } from '../src/screens/render-screens.mjs';
import { scanScreens } from '../src/screens/scan-screens.mjs';

const CONFIG = `import { defineScreens } from '@drizztdourden08/brock-react';

export default defineScreens({
  buckets: [
    { id: 'game', title: 'Game', icon: 'gamepad-2', menu: 'entry' },
    { id: 'data', title: 'Data', icon: 'layers', menu: 'submenu' },
  ],
  home: 'game',
});
`;

const PAGE = 'const Page = () => null;\n\nexport default Page;\n';
const WITH_META = "const meta = { title: 'X' };\nconst Page = () => null;\n\nexport default Page;\nexport { meta };\n";

const roots = [];

const appWith = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-scan-'));
  roots.push(root);
  for (const [path, content] of Object.entries({ 'src/screens/screens.config.ts': CONFIG, ...files })) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
};

const VALID = {
  'src/screens/game/home.hero.tsx': WITH_META,
  'src/screens/game/saves.page.tsx': PAGE,
  'src/screens/game/video/display.settings.ts': 'export default [];\n',
  'src/screens/game/tracker/items.tab.tsx': PAGE,
  'src/screens/game/tracker/map.tab.tsx': PAGE,
  'src/screens/data/library.page.tsx': PAGE,
  'src/screens/credits.card.tsx': WITH_META,
  'src/screens/playfield.custom.tsx': PAGE,
};

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('scanScreens', () => {
  it('reads every kind from its suffix and place', () => {
    const { files, findings, buckets } = scanScreens(appWith(VALID));
    expect(findings).toEqual([]);
    expect(buckets).toEqual(['data', 'game']);
    const summary = files.map((file) => [file.kind, file.bucket ?? '', file.group ?? '', file.page ?? '', file.id].join(':'));
    expect(summary.sort()).toEqual([
      'card::::credits', 'custom::::playfield', 'hero:game:::home', 'page:data:::library', 'page:game:::saves',
      'settings:game:video::display', 'tab:game::tracker:items', 'tab:game::tracker:map',
    ]);
    expect(files.find((file) => file.id === 'home')?.hasMeta).toBe(true);
    expect(files.find((file) => file.id === 'saves')?.hasMeta).toBe(false);
  });

  it('rejects an unknown suffix, two homes, a tab outside a page folder and a misplaced card', () => {
    const { findings } = scanScreens(appWith({
      'src/screens/game/home.hero.tsx': PAGE,
      'src/screens/game/start.hero.tsx': PAGE,
      'src/screens/game/Helper.tsx': PAGE,
      'src/screens/items.tab.tsx': PAGE,
      'src/screens/game/credits.card.tsx': PAGE,
    }));
    expect(findings.some((f) => f.startsWith('src/screens/game/Helper.tsx: unknown screen file'))).toBe(true);
    expect(findings.some((f) => f.startsWith('src/screens/items.tab.tsx: a tab sits in its page folder'))).toBe(true);
    expect(findings.some((f) => f.startsWith('src/screens/game/credits.card.tsx: card screens sit at the root'))).toBe(true);
    expect(findings.some((f) => f.includes('two homes (home.hero.tsx, start.hero.tsx)'))).toBe(true);
  });
});

describe('checkScreens', () => {
  it('passes a valid layout', async () => {
    expect(await checkScreens(appWith(VALID))).toEqual([]);
  });

  it('names a bucket folder the config does not declare', async () => {
    const findings = await checkScreens(appWith({ ...VALID, 'src/screens/tools/index.page.tsx': PAGE }));
    expect(findings).toEqual(["src/screens/tools: bucket folder not declared in screens.config.ts; add { id: 'tools', ... } to buckets"]);
  });

  it('skips an app without screens.config.ts', async () => {
    const root = mkdtempSync(join(tmpdir(), 'brock-scan-'));
    roots.push(root);
    expect(await checkScreens(root)).toEqual([]);
  });
});

describe('renderScreens', () => {
  it('imports each default export and meta, and lists the entries', () => {
    const { files } = scanScreens(appWith(VALID));
    const out = renderScreens(files);
    expect(out).toContain("import config from '../src/screens/screens.config';");
    expect(out).toContain("import GameHomeHero, { meta as gameHomeHeroMeta } from '../src/screens/game/home.hero';");
    expect(out).toContain("import GameTrackerItemsTab from '../src/screens/game/tracker/items.tab';");
    expect(out).toContain("{ kind: 'tab', bucket: 'game', page: 'tracker', id: 'items', component: GameTrackerItemsTab },");
    expect(out).toContain("{ kind: 'settings', bucket: 'game', group: 'video', id: 'display', sections: GameVideoDisplaySettings },");
    expect(out).toContain('export { screenTree };');
  });
});
