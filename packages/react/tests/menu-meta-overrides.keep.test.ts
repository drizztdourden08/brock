/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { buildMenu } from '../src/app/BrockApp/behavior/build-menu';
import { resolveShellMenu } from '../src/app/BrockApp/behavior/resolve-shell-menu';
import type { MenuBuildInput } from '../src/app/BrockApp/BrockApp.type';
import type { MenuEntry, MenuItem } from '../src/menu/menu.type';
import { menuOverrideChecks } from '../src/review/checks/menu-override-checks';
import { hiddenRoutes } from '../src/review/menu/hidden-routes';
import { menuExpectation } from '../src/review/menu/menu-expectation';
import { menuReachIds } from '../src/review/menu/menu-reach-ids';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import { deriveMenu } from '../src/screens/conventions/derive-menu';
import { resolveScreenTree } from '../src/screens/conventions/resolve-screen-tree';
import type { ScreenEntry } from '../src/screens/conventions/screen-tree.type';
import type { ScreensConfig } from '../src/screens/conventions/screens-config.type';

const View = () => null;
const noop = (): void => undefined;

const CONFIG: ScreensConfig = {
  buckets: [
    { id: 'home', title: 'Start', icon: 'house', menu: 'entry' },
    { id: 'tools', title: 'Tools', icon: 'wrench', menu: 'submenu' },
    { id: 'library', title: 'Library', icon: 'folder', menu: 'entry' },
  ],
  home: 'home',
};

const ENTRIES: ScreenEntry[] = [
  { kind: 'page', bucket: 'home', id: 'overview', component: View },
  { kind: 'page', bucket: 'tools', id: 'notes', component: View },
  { kind: 'page', bucket: 'tools', id: 'clock', component: View, meta: { menu: { label: 'Timer' } } },
  { kind: 'page', bucket: 'tools', id: 'ruler', component: View, meta: { menu: { parent: null, before: 'bucket:library' } } },
  { kind: 'page', bucket: 'library', id: 'shelves', component: View },
  { kind: 'page', bucket: 'library', id: 'loans', component: View, meta: { menu: { parent: 'bucket:tools' } } },
  { kind: 'card', id: 'glossary', component: View, meta: { menu: { hidden: true } } },
  { kind: 'card', id: 'index', component: View, meta: { menu: { inMenu: false } } },
];

const tree = buildScreenTree(CONFIG, ENTRIES);
const appMenu = deriveMenu(CONFIG, tree.hubs, tree.screens);
const INPUT: MenuBuildInput = {
  appMenu, moduleMenu: [], widgets: [], homeScreen: 'home', hasCredits: false, developerTools: false, onQuit: noop, onDevConsole: noop, onReportBug: noop, onShortcuts: noop,
  menuConfig: { entries: { profiles: { label: 'People' }, 'bucket:library': { after: 'settings' } } },
};

const keys = (entries: readonly MenuEntry[]): string[] => entries.map((entry) => (entry === 'separator' ? '|' : entry.key));
const childrenOf = (entries: readonly MenuEntry[], key: string): MenuEntry[] =>
  entries.find((entry): entry is MenuItem => entry !== 'separator' && entry.key === key)?.children ?? [];

describe('menu overrides from screen meta', () => {
  const menu = buildMenu(INPUT);

  it('renames a page in place', () => {
    expect(childrenOf(menu, 'bucket:tools').map((entry) => entry !== 'separator' && entry.label)).toContain('Timer');
  });

  it('lifts a page out of its bucket submenu and moves it beside another entry', () => {
    expect(keys(menu).slice(0, 6)).toEqual(['home', 'profiles', 'settings', 'bucket:tools:ruler', 'bucket:library', 'bucket:tools']);
  });

  it('gives a page of an entry bucket a place when its meta names one', () => {
    expect(keys(childrenOf(menu, 'bucket:tools'))).toEqual(['bucket:tools:clock', 'bucket:tools:notes', 'bucket:library:loans']);
  });

  it('hides a card from the menu while the app config renames and moves the rest', () => {
    expect(keys(menu)).not.toContain('screen:glossary');
    expect(menu.find((entry): entry is MenuItem => entry !== 'separator' && entry.key === 'profiles')?.label).toBe('People');
  });

  it('leaves the hidden card out of the screens the review looks for in the menu', () => {
    const { overrides } = resolveShellMenu(INPUT);
    const resolved = resolveScreenTree(tree, []);
    expect(menuReachIds(resolved)).toContain('glossary');
    expect(menuReachIds(resolved, hiddenRoutes(overrides))).not.toContain('glossary');
    expect(menuReachIds(resolved, hiddenRoutes(overrides))).not.toContain('index');
  });
});

describe('the review of the effective menu', () => {
  const { overrides } = resolveShellMenu(INPUT);
  const menu = buildMenu(INPUT);
  const drawn: Record<string, string[]> = {
    '': ['Home', 'People', 'Settings', 'Ruler', 'Library', 'Tools', 'About', 'Quit'],
    Tools: ['Timer', 'Notes', 'Loans'],
  };

  it('passes a renamed, a moved, a hidden and a re-parented entry drawn as configured', () => {
    const outcomes = menuOverrideChecks(overrides, menu, (parents) => drawn[parents.join(' > ')] ?? null);
    expect(outcomes.filter((entry) => !entry.pass)).toEqual([]);
    expect(outcomes.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      'menu-entry-profiles', 'menu-entry-bucket:library', 'menu-entry-screen:glossary', 'menu-entry-screen:index', 'menu-entry-bucket:library:loans',
    ]));
  });

  it('names each entry the menu draws elsewhere', () => {
    const wrong: Record<string, string[]> = { '': ['Home', 'Profiles', 'Settings', 'Library', 'Ruler', 'Tools', 'Glossary', 'About', 'Quit'], Tools: ['Clock', 'Notes'] };
    const failed = menuOverrideChecks(overrides, menu, (parents) => wrong[parents.join(' > ')] ?? null).filter((entry) => !entry.pass).map((entry) => entry.id);
    expect(failed).toEqual(expect.arrayContaining(['menu-entry-profiles', 'menu-entry-bucket:library', 'menu-entry-screen:glossary', 'menu-entry-bucket:library:loans']));
  });

  it('expects the built-ins where the effective menu has them', () => {
    const hidden = buildMenu({ ...INPUT, menuConfig: { entries: { profiles: { hidden: true } } } });
    expect(menuExpectation(hidden, 'home', {}, new Set(['profiles'])).required).toEqual(['Home', 'Settings', 'About', 'Quit']);
    expect(menuExpectation(menu, 'home', {}, new Set(['profiles'])).required).toContain('People');
    expect(menuExpectation(menu, 'home', { controls: { pin: true, fullscreen: true }, viewLabel: 'Window' }).view).toBe('Window');
  });
});
