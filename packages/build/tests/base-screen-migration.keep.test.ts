/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { collectMigrations, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const MAIN = [
  "import { BrockApp } from '@drizztdourden08/brock-react';",
  "import { screenTree } from '../.brock/screens';",
  "import { BASE_SCREEN } from './hooks/app-navigation.constants';",
  "import { MENU, SCREENS, SETTINGS } from './main.constants';",
  '',
  'createRoot(root).render(',
  '  <StrictMode>',
  '    <BrockApp<AppSettings>',
  '      settings={SETTINGS}',
  '      screenTree={screenTree}',
  '      screens={SCREENS}',
  '      home={BASE_SCREEN}',
  '      menu={MENU}',
  '    />',
  '  </StrictMode>,',
  ');',
  '',
].join('\n');

const CONSTANTS = [
  "import { createElement } from 'react';",
  "import { defineScreen } from '@drizztdourden08/brock-react';",
  "import type { BrockAppSettings, MenuEntry } from '@drizztdourden08/brock-react';",
  "import { Icon } from '@drizztdourden08/tessera/primitives';",
  "import { BASE_SCREEN } from './hooks/app-navigation.constants';",
  "import { DEFAULT_SETTINGS } from './settings.constants';",
  "import { SessionDashboard } from './views/SessionDashboard';",
  '',
  'const SETTINGS: BrockAppSettings<AppSettings> = { defaults: DEFAULT_SETTINGS };',
  '',
  'const SCREENS = [',
  '  defineScreen({',
  '    id: BASE_SCREEN,',
  "    title: 'Session',",
  "    icon: createElement(Icon, { name: 'radio' }),",
  "    header: 'own',",
  '    render: () => createElement(SessionDashboard),',
  '  }),',
  '];',
  '',
  "const MENU: MenuEntry[] = ['separator'];",
  '',
  'export { MENU, SCREENS, SETTINGS };',
  '',
].join('\n');

const NAV = "const BASE_SCREEN = 'session';\nconst ROUTE = { sessions: 'multiworld/sessions' } as const;\n\nexport { BASE_SCREEN, ROUTE };\n";

const made: string[] = [];

const appWith = (files: Record<string, string>): string => {
  const root = mkdtempSync(join(tmpdir(), 'brock-base-'));
  made.push(root);
  for (const [path, content] of Object.entries({ 'package.json': '{"name":"x"}', ...files })) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
};

const ARCHIPELIA = {
  'apps/desktop/src/main.tsx': MAIN,
  'apps/desktop/src/main.constants.ts': CONSTANTS,
  'apps/desktop/src/hooks/app-navigation.constants.ts': NAV,
  'apps/desktop/src/screens/screens.config.ts': 'export default {};\n',
};

const baseStep = () => selectMigrations(collectMigrations([]), { from: '0.16.0', to: '0.17.0' }).filter((m) => m.file.endsWith('base-screen-file.mjs'));
const read = (root: string, path: string): string => readFileSync(join(root, path), 'utf8');

afterEach(() => {
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('base-screen-file', () => {
  it('moves the Session dashboard to src/screens/session.base.tsx and drops screens and home, once', async () => {
    const root = appWith(ARCHIPELIA);
    const run = await runMigrations(root, baseStep());
    expect(run.todos).toEqual([]);
    expect(run.applied[0]?.touched).toEqual(['apps/desktop/src/screens/session.base.tsx', 'apps/desktop/src/main.constants.ts', 'apps/desktop/src/main.tsx']);
    expect(read(root, 'apps/desktop/src/screens/session.base.tsx')).toBe([
      '/* @layer renderer-app @kind component */',
      "import type { ScreenMeta } from '@drizztdourden08/brock-react';",
      "import { SessionDashboard } from '../views/SessionDashboard';",
      '',
      "const meta: ScreenMeta = { title: 'Session', icon: 'radio' };",
      '',
      'const SessionBase = () => <SessionDashboard />;',
      '',
      'export default SessionBase;',
      'export { meta };',
      '',
    ].join('\n'));
    const constants = read(root, 'apps/desktop/src/main.constants.ts');
    expect(constants).not.toMatch(/SCREENS|defineScreen|createElement|Icon|SessionDashboard|BASE_SCREEN/);
    expect(constants).toContain('export { MENU, SETTINGS };');
    const main = read(root, 'apps/desktop/src/main.tsx');
    expect(main).not.toMatch(/home=|screens=|BASE_SCREEN|SCREENS/);
    expect(main).toContain("import { MENU, SETTINGS } from './main.constants';");
    expect(main).toContain('      menu={MENU}');
    const again = await runMigrations(root, baseStep());
    expect(again.applied[0]?.touched).toEqual([]);
    expect(again.todos).toEqual([]);
  });

  it('leaves a precise to-do when the screen is more than a title, an icon and a component', async () => {
    const root = appWith({ ...ARCHIPELIA, 'apps/desktop/src/main.constants.ts': CONSTANTS.replace("    header: 'own',", '    keepMounted: true,') });
    const run = await runMigrations(root, baseStep());
    expect(run.applied[0]?.touched).toEqual([]);
    expect(run.todos).toHaveLength(1);
    expect(run.todos[0]).toMatchObject({ file: 'apps/desktop/src/main.tsx', line: 12 });
    expect(run.todos[0]?.message).toContain('Move the screen "session" to src/screens/session.base.tsx');
    expect(existsSync(join(root, 'apps/desktop/src/screens/session.base.tsx'))).toBe(false);
  });

  it('waits for screens by convention before it moves anything', async () => {
    const root = appWith({ 'src/main.tsx': MAIN.replace('home={BASE_SCREEN}', "home=\"session\"") });
    const run = await runMigrations(root, baseStep());
    expect(run.todos[0]?.message).toContain('has no src/screens/screens.config.ts yet, so its base screen "session" stays');
  });
});
