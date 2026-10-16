/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { createElement } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { buildMenu } from '../src/app/BrockApp/behavior/build-menu';
import { visibleHubPages } from '../src/hub/Hub/behavior/visible-hub-pages';
import type { MenuEntry } from '../src/menu/menu.type';
import { PlatformProvider } from '../src/platform/PlatformProvider';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import { deriveMenu } from '../src/screens/conventions/derive-menu';
import type { ScreenEntry } from '../src/screens/conventions/screen-tree.type';
import type { ScreensConfig } from '../src/screens/conventions/screens-config.type';
import { currentShowContext } from '../src/screens/show/current-show-context';
import { hiddenRoutes } from '../src/screens/show/hidden-routes';
import { isShown } from '../src/screens/show/is-shown';
import { APP_FLAGS_SOURCE } from '../src/screens/show/show.constants';
import type { ShowContext, ShowFlagValues } from '../src/screens/show/show.type';
import { useShowContext } from '../src/screens/show/useShowContext';
import { useShowFlags } from '../src/screens/show/useShowFlags';
import { useShowFlagsSource } from '../src/screens/show/useShowFlagsSource';
import { useShowFlagsStore } from '../src/screens/show/useShowFlagsStore';
import { showHarness } from './show-harness';

const View = () => null;
const noop = (): void => undefined;
const signedIn = ({ flags }: ShowContext): boolean => flags.signedIn === true;

const CONFIG: ScreensConfig = {
  buckets: [
    { id: 'main', title: 'Main', icon: 'house', menu: 'submenu' },
    { id: 'team', title: 'Team', icon: 'users', menu: 'entry', when: signedIn },
  ],
  home: 'main',
};

const ENTRIES: ScreenEntry[] = [
  { kind: 'page', bucket: 'main', id: 'overview', component: View, meta: { order: 0 } },
  { kind: 'page', bucket: 'main', id: 'account', component: View, meta: { when: signedIn } },
  { kind: 'page', bucket: 'team', id: 'members', component: View },
];

const tree = buildScreenTree(CONFIG, ENTRIES);
const ctxWith = (flags: ShowFlagValues): ShowContext => ({ profile: null, host: 'web', formFactor: 'desktop', flags });
const labels = (entries: readonly MenuEntry[]): string[] => entries.flatMap((entry) => (entry === 'separator' ? [] : [entry.label, ...labels(entry.children ?? [])]));

afterEach(showHarness.resetShow);

describe('app flags in show rules', () => {
  it('reads a flag in a when rule of a bucket, a page and the menu', () => {
    const main = tree.hubs.find((hub) => hub.id === 'main');
    expect(main && visibleHubPages(main, false, ctxWith({})).pages.map((page) => page.id)).toEqual(['overview']);
    expect(main && visibleHubPages(main, false, ctxWith({ signedIn: true })).pages.map((page) => page.id)).toEqual(['overview', 'account']);
    expect([...hiddenRoutes(tree.hubs, tree.screens, ctxWith({}))].sort()).toEqual(['main/account', 'team']);
    expect([...hiddenRoutes(tree.hubs, tree.screens, ctxWith({ signedIn: true }))]).toEqual([]);
    const appMenu = deriveMenu(CONFIG, tree.hubs, tree.screens);
    const menuOn = (show: ShowContext): string[] => labels(buildMenu({ appMenu, moduleMenu: [], widgets: [], homeScreen: 'main', hasCredits: false, developerTools: false, show, onQuit: noop, onDevConsole: noop, onReportBug: noop, onShortcuts: noop }));
    expect(menuOn(ctxWith({}))).not.toContain('Team');
    expect(menuOn(ctxWith({ signedIn: true }))).toEqual(expect.arrayContaining(['Team', 'Account']));
  });

  it('merges every source, the app flags last, and drops a source when it unmounts', () => {
    const { put, drop } = useShowFlagsStore.getState();
    put(APP_FLAGS_SOURCE, { signedIn: false });
    put('module', { signedIn: true, beta: true });
    expect(useShowFlagsStore.getState().flags).toEqual({ signedIn: false, beta: true });
    drop(APP_FLAGS_SOURCE);
    expect(useShowFlagsStore.getState().flags).toEqual({ signedIn: true, beta: true });
    const before = useShowFlagsStore.getState().flags;
    put('module', { signedIn: true, beta: true });
    expect(useShowFlagsStore.getState().flags).toBe(before);
  });

  it('gives the current flags to currentShowContext, so a rule read at key time sees them', () => {
    useShowFlagsStore.getState().put(APP_FLAGS_SOURCE, { signedIn: true });
    expect(currentShowContext().flags).toEqual({ signedIn: true });
    expect(isShown({ when: signedIn })).toBe(true);
    useShowFlagsStore.getState().put(APP_FLAGS_SOURCE, { signedIn: false });
    expect(isShown({ when: signedIn })).toBe(false);
  });

  it('re-renders a show context reader when a flag flips, from the app source or a hook', () => {
    const Reader = () => createElement('output', null, JSON.stringify(useShowContext().flags));
    const App = (props: { app?: ShowFlagValues; extra: boolean }) => {
      useShowFlagsSource(APP_FLAGS_SOURCE, props.app);
      return createElement('div', null, props.extra ? createElement(Extra) : null, createElement(Reader));
    };
    const Extra = () => {
      useShowFlags({ beta: true });
      return null;
    };
    const host = showHarness.render(createElement(PlatformProvider, null, createElement(App, { app: { signedIn: false }, extra: false })));
    expect(host.textContent).toBe('{"signedIn":false}');
    showHarness.render(createElement(PlatformProvider, null, createElement(App, { app: { signedIn: true }, extra: true })));
    expect(host.textContent).toBe('{"beta":true,"signedIn":true}');
    showHarness.render(createElement(PlatformProvider, null, createElement(App, { extra: false })));
    expect(host.textContent).toBe('{}');
  });
});
