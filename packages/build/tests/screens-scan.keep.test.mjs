/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { checkScreens } from '../src/screens/check-screens.mjs';
import { renderScreens } from '../src/screens/render-screens.mjs';
import { scanScreens } from '../src/screens/scan-screens.mjs';
import { customPageCounts } from '../src/screens/search/custom-page-counts.mjs';
import { renderSearch } from '../src/screens/search/render-search.mjs';

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
const CUSTOM = [
  "import type { ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';",
  "const meta: ScreenMeta = { title: 'Controls', icon: 'keyboard', keywords: ['Bindings', 'Keys'] };",
  'const searchEntries: SearchEntrySeed[] = [',
  "  { label: 'Jump', keywords: ['Space', 'button A'], anchor: 'jump' }, // the main action",
  "  { label: `Pause`, anchor: 'pause', description: 'Stops the run.' },",
  '];',
  'const ControlsPage = () => <div>{searchEntries.length}</div>;',
  'export default ControlsPage;',
  'export { meta, searchEntries };',
  '',
].join('\n');
const SETTINGS = [
  "const modes = [{ value: 'a', label: 'A' }];",
  'const asPercent = (value: number): string => `${value}%`;',
  'const sections: Section[] = [',
  "  { id: 'window', title: 'Window', items: [{ key: 'windowMode', label: 'Window mode', description: 'How it opens.', hint: 'Pick how the window opens.', keywords: 'Borderless', control: { kind: 'choice', options: modes } }] },",
  "  { id: 'audio', title: 'Audio', subsections: [{ id: 'mix', title: 'Mix', items: [{ key: 'volume', label: 'Volume', description: 'Level.', hint: 'Drag to set the level.', control: { kind: 'range', format: asPercent } }] }] },",
  '];',
  'export default sections;',
  '',
].join('\n');

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
  'src/screens/playfield.layer.tsx': PAGE,
  'src/screens/game/controls.custom.tsx': CUSTOM,
  'src/screens/game/general.settings.ts': SETTINGS,
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
      'card::::credits', 'custom:game:::controls', 'hero:game:::home', 'layer::::playfield', 'page:data:::library', 'page:game:::saves',
      'settings:game:::general', 'settings:game:video::display', 'tab:game::tracker:items', 'tab:game::tracker:map',
    ]);
    expect(files.find((file) => file.id === 'home')?.hasMeta).toBe(true);
    expect(files.find((file) => file.id === 'saves')?.hasMeta).toBe(false);
    expect(files.find((file) => file.id === 'controls')?.hasSearchEntries).toBe(true);
  });

  it('names a root custom file as a layer and a custom page without searchEntries', async () => {
    const root = appWith({ ...VALID, 'src/screens/arena.custom.tsx': PAGE, 'src/screens/game/map.custom.tsx': PAGE });
    const findings = await checkScreens(root);
    expect(findings.some((f) => f.startsWith('src/screens/arena.custom.tsx: a custom page sits in a bucket folder') && f.includes('.layer.tsx'))).toBe(true);
    expect(findings.some((f) => f.startsWith('src/screens/game/map.custom.tsx: a custom page exports searchEntries'))).toBe(true);
  });

  it('rejects searchEntries the build cannot read without loading the page', async () => {
    const computed = 'const searchEntries = ACTIONS.map((a) => ({ label: a.label }));\nconst Page = () => null;\nexport default Page;\nexport { searchEntries };\n';
    const findings = await checkScreens(appWith({ ...VALID, 'src/screens/game/map.custom.tsx': computed }));
    expect(findings).toEqual(['src/screens/game/map.custom.tsx: searchEntries must be a literal list of { label, keywords?, anchor?, description? }, since the build reads it from the source without loading the page']);
  });

  it('counts custom pages per bucket', () => {
    const { files, buckets } = scanScreens(appWith(VALID));
    expect(customPageCounts(files, buckets)).toBe('data 0, game 1');
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
    expect(out).toContain("import { searchIndex } from './search';");
    expect(out).toContain('], searchIndex);');
    expect(out).toContain("{ kind: 'custom', bucket: 'game', id: 'controls', component: GameControlsCustom, meta: gameControlsCustomMeta },");
    expect(out).toContain('export { screenTree };');
  });
});

describe('renderSearch', () => {
  const root = appWith(VALID);
  const out = renderSearch(root, scanScreens(root).files);
  const seed = (id) => JSON.parse(out.split('\n').find((line) => line.includes(`"id":"${id}"`))?.trim().replace(/,$/, '') ?? 'null');

  it('imports only the config and buildSearchIndex, never a screen file', () => {
    expect(out).toContain("import { buildSearchIndex } from '@drizztdourden08/brock-react';");
    expect(out).toContain("import config from '../src/screens/screens.config';");
    expect(out.match(/^import /gm)).toHaveLength(2);
    expect(out).toContain('export { searchIndex };');
  });

  it('normalises keywords and reads custom page entries', () => {
    expect(seed('controls')).toEqual({
      kind: 'custom', id: 'controls', bucket: 'game', title: 'Controls', icon: 'keyboard', keywords: ['bindings', 'keys'],
      entries: [
        { label: 'Jump', keywords: ['space', 'button', 'a'], anchor: 'jump' },
        { label: 'Pause', keywords: [], anchor: 'pause', description: 'Stops the run.' },
      ],
    });
  });

  it('reads settings rows past references and functions, and subsections', () => {
    expect(seed('general')).toEqual({
      kind: 'settings', id: 'general', bucket: 'game',
      sections: [
        { id: 'window', title: 'Window', rows: [{ key: 'windowMode', label: 'Window mode', description: 'How it opens.', hint: 'Pick how the window opens.', keywords: ['borderless'] }] },
        { id: 'mix', title: 'Audio', sub: 'Mix', rows: [{ key: 'volume', label: 'Volume', description: 'Level.', hint: 'Drag to set the level.', keywords: [] }] },
      ],
    });
  });
});
