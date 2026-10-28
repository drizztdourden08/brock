/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { createElement } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { buildMenu } from '../src/app/BrockApp/behavior/build-menu';
import type { MenuBuildInput } from '../src/app/BrockApp/BrockApp.type';
import { Hub } from '../src/hub/Hub';
import { railNav } from '../src/hub/Hub/behavior/rail-nav';
import { showsHubNav } from '../src/hub/Hub/behavior/shows-hub-nav';
import { HubHeader } from '../src/hub/Hub/sub-components/HubHeader';
import type { HubDef, HubPage } from '../src/hub/hub.type';
import type { MenuEntry, MenuItem } from '../src/menu/menu.type';
import { resolveRoute } from '../src/navigation/resolve-route';
import { PlatformProvider } from '../src/platform/PlatformProvider';
import { assertScreensConfig } from '../src/screens/conventions/assert-screens-config';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import { configAliases } from '../src/screens/conventions/config-aliases';
import { resolveScreenTree } from '../src/screens/conventions/resolve-screen-tree';
import { settingsTitleOf } from '../src/screens/conventions/settings-title-of';
import type { ScreensConfig } from '../src/screens/conventions/screens-config.type';
import { showHarness } from './show-harness';

const page = (id: string): HubPage => ({ id, label: id, icon: null, fullBleed: true, render: () => createElement('p', null, `page ${id}`) });

const hubWith = (extra: Partial<HubDef>): HubDef => ({
  id: 'props', title: 'Properties', icon: null, home: page('home'), groups: [{ id: 'main', label: 'Main', pages: [page('summary')] }], search: { placeholder: 'Search' }, ...extra,
});

const draw = (def: HubDef, params: Record<string, unknown> = {}): void => {
  const ctx = { params, profile: null, close: () => undefined, open: () => undefined };
  showHarness.render(createElement(PlatformProvider, null, createElement(Hub, { def, ctx }), createElement(HubHeader, { hub: def })));
};

afterEach(showHarness.resetShow);

describe('the hub header', () => {
  it('draws the bucket header from the hub render context, with its actions on the right', () => {
    const def = hubWith({
      header: {
        render: (ctx) => createElement('b', { className: 'chip' }, `${ctx.page.label}:${String(ctx.params.subject)}`),
        actions: (ctx) => createElement('i', { className: 'act' }, ctx.hub.title),
      },
    });
    draw(def, { subject: 'a.png', section: 'summary' });
    expect(document.querySelector('.hub-header__main .chip')?.textContent).toBe('summary:a.png');
    expect(document.querySelector('.hub-header__actions .act')?.textContent).toBe('Properties');
    draw(def, { subject: 'b.png' });
    expect(document.querySelector('.hub-header__main .chip')?.textContent).toBe('home:b.png');
  });

  it('draws nothing for a hub with no header, and no actions area when there are no actions', () => {
    draw(hubWith({}));
    expect(document.querySelector('.hub-header')).toBeNull();
    showHarness.unmount();
    draw(hubWith({ header: { render: () => createElement('b', { className: 'chip' }, 'x') } }));
    expect(document.querySelector('.hub-header__actions')).toBeNull();
    expect(document.querySelector('.chip')).not.toBeNull();
  });
});

describe('nav: rail', () => {
  it('draws the hub nav as an icon rail, without the nav search', () => {
    expect(railNav('rail')).toEqual({ variant: 'rail', collapsed: true });
    expect(railNav('auto')).toEqual({});
    expect(railNav(undefined)).toEqual({});
    expect(showsHubNav('rail', 1)).toBe(false);
    expect(showsHubNav('rail', 2)).toBe(true);
    draw(hubWith({ nav: 'rail' }));
    expect(document.querySelector('.side-nav--rail')).not.toBeNull();
    expect(document.querySelector('.side-nav__search-input, .side-nav__search')).toBeNull();
  });
});

describe('ScreensConfig.aliases', () => {
  const aliasOf = (name: string) => configAliases({ asset: 'properties', app: 'options/general' })[name];

  it('sends the old name to the new bucket, keeping params and deep links', () => {
    expect(resolveRoute('asset', { subject: 'a' }, aliasOf)).toEqual({ active: 'properties', params: { subject: 'a' } });
    expect(resolveRoute('asset/summary/info', {}, aliasOf)).toEqual({ active: 'properties', params: { section: 'summary', tab: 'info' } });
    expect(resolveRoute('app', {}, aliasOf)).toEqual({ active: 'options', params: { section: 'general', tab: undefined } });
    expect(resolveRoute('other/page', {}, aliasOf)).toEqual({ active: 'other', params: { section: 'page', tab: undefined } });
  });

  it('is carried to the resolved tree', () => {
    const View = () => null;
    const config: ScreensConfig = {
      buckets: [{ id: 'properties', title: 'Properties', icon: 'house', menu: 'entry' }, { id: 'options', title: 'Options', icon: 'settings', menu: 'entry' }],
      home: 'properties',
      settings: { bucket: 'options' },
      aliases: { asset: 'properties' },
    };
    const tree = resolveScreenTree(buildScreenTree(config, [{ kind: 'page', bucket: 'properties', id: 'a', component: View }, { kind: 'page', bucket: 'options', id: 'b', component: View }]), []);
    expect(Object.keys(tree.aliases)).toEqual(['asset']);
    expect(tree.aliases.asset?.({ x: 1 })).toEqual({ active: 'properties', params: { x: 1 } });
  });

  it('refuses an alias that hides a bucket or points at nothing', () => {
    const base: ScreensConfig = { buckets: [{ id: 'properties', title: 'Properties', icon: 'house', menu: 'entry' }], home: 'properties' };
    expect(() => assertScreensConfig({ ...base, aliases: { properties: 'properties' } }, [])).toThrow('has the id of a bucket');
    expect(() => assertScreensConfig({ ...base, aliases: { asset: 'gone' } }, [])).toThrow('not a bucket or a screen');
    expect(() => assertScreensConfig({ ...base, aliases: { asset: 'properties/summary' } }, [])).not.toThrow();
  });
});

describe('the settings bucket title', () => {
  const noop = (): void => undefined;
  const INPUT: MenuBuildInput = { appMenu: [], moduleMenu: [], widgets: [], homeScreen: 'game', hasCredits: false, developerTools: false, onQuit: noop, onDevConsole: noop, onReportBug: noop, onShortcuts: noop };
  const labelOf = (entries: readonly MenuEntry[], key: string): string | undefined =>
    entries.find((entry): entry is MenuItem => entry !== 'separator' && entry.key === key)?.label;

  it('names the menu entry after the bucket title, and says Settings with no bucket', () => {
    expect(labelOf(buildMenu(INPUT), 'settings')).toBe('Settings');
    expect(labelOf(buildMenu({ ...INPUT, settingsTitle: 'Options' }), 'settings')).toBe('Options');
    expect(settingsTitleOf(null)).toBe('Settings');
    const View = () => null;
    const config: ScreensConfig = { buckets: [{ id: 'options', title: 'Options', icon: 'settings', menu: 'entry' }], home: 'options' };
    const tree = resolveScreenTree(buildScreenTree(config, [{ kind: 'page', bucket: 'options', id: 'b', component: View }]), []);
    expect(settingsTitleOf(tree)).toBe('Options');
  });
});
