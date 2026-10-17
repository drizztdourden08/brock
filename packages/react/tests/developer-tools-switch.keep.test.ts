/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createPlatform } from '@drizztdourden08/brock-core';
import { createDefaultLayout, isWidgetOpen } from '@drizztdourden08/tessera/composites';
import { useDeveloperTools } from '../src/app/useDeveloperTools';
import { bindDeveloperTools } from '../src/developer-tools/bind-developer-tools';
import { developerTools } from '../src/developer-tools/developer-tools';
import { developerToolsFromSettings } from '../src/developer-tools/developer-tools-from-settings';
import { useDeveloperToolsOff } from '../src/developer-tools/useDeveloperToolsOff';
import { useDeveloperToolsStore } from '../src/developer-tools/useDeveloperToolsStore';
import type { MenuItem } from '../src/menu/menu.type';
import { PlatformContext } from '../src/platform/platform-context';
import { createWebFactory } from '../src/platform/hosts/web-factory';
import { createSettingsStore } from '../src/stores/create-settings-store';
import { SettingsStoreContext } from '../src/stores/settings-context';
import type { SettingsStore } from '../src/stores/settings-store.type';
import { arrangeWidgetMenu } from '../src/widgets/arrange-widget-menu';
import { defineWidget } from '../src/widgets/define-widget';
import { defineWidgetKit } from '../src/widgets/kits/define-widget-kit';
import { useWidgetKitStore } from '../src/widgets/kits/useWidgetKitStore';
import { widgetKits } from '../src/widgets/kits/widget-kits';
import { useWidgetLayoutStore } from '../src/widgets/useWidgetLayoutStore';
import { widgets } from '../src/widgets/widgets';
import { WIDGETS_DEVELOPER_KEY } from '../src/widgets/widget.constants';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

interface AppSettings {
  contributing: { developerTools: boolean };
}

const noop = (): void => undefined;
const widget = (id: string, extra: { devOnly?: boolean; popOut?: boolean; kit?: string } = {}) => defineWidget({ id, label: id, defaultSide: 'right', render: () => null, ...extra });
const ITEMS: MenuItem[] = [
  { key: 'widget-clock', label: 'Clock', onClick: noop },
  { key: 'widget-probe', label: 'Probe', devOnly: true, onClick: noop },
  { key: 'kit-inspect', label: 'Inspect', devOnly: true, onClick: noop },
];

const web = createPlatform(createWebFactory());
const devRun = { ...web, info: { ...web.info, isDev: true } };
const seen = { on: false, menu: [] as string[] };

const Probe = () => {
  const on = useDeveloperTools();
  useDeveloperToolsOff();
  seen.on = on;
  seen.menu = arrangeWidgetMenu(ITEMS, undefined, on).map((item) => item.key);
  return null;
};

let root: Root | null = null;
let unbind: (() => void) | null = null;

const settingsStore = (): SettingsStore<AppSettings> => {
  const store = createSettingsStore<AppSettings>({ defaults: { contributing: { developerTools: true } }, load: () => Promise.resolve(null), save: () => Promise.resolve() });
  store.setState({ hydrated: true });
  return store;
};

const mount = (store: SettingsStore<AppSettings>): void => {
  root = createRoot(document.body.appendChild(document.createElement('div')));
  const tree = createElement(PlatformContext.Provider, { value: devRun }, createElement(SettingsStoreContext.Provider, { value: store }, createElement(Probe)));
  act(() => root?.render(tree));
};

const switchTo = (store: SettingsStore<AppSettings>, on: boolean): void => {
  act(() => store.getState().patch({ contributing: { developerTools: on } }));
};

beforeEach(() => {
  useWidgetLayoutStore.setState({ definitions: [widget('clock'), widget('probe', { devOnly: true, popOut: true }), widget('trace', { devOnly: true })], layout: createDefaultLayout(), externalDrag: null });
  useWidgetKitStore.setState({ kits: [], members: [], active: null, views: {} });
  useWidgetKitStore.getState().setKits([defineWidgetKit({ id: 'inspect', label: 'Inspect', devOnly: true })], [widget('grid', { kit: 'inspect' })]);
});

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  unbind?.();
  unbind = null;
  document.body.innerHTML = '';
});

describe('binding developer tools to an app setting', () => {
  it('reads and writes a nested settings key, and the store follows it', () => {
    const store = settingsStore();
    unbind = bindDeveloperTools(developerToolsFromSettings('contributing.developerTools')(store));
    expect(useDeveloperToolsStore.getState()).toMatchObject({ on: true });
    expect(developerTools.bound()).toBe(true);
    developerTools.set(false);
    expect(store.getState().settings.contributing.developerTools).toBe(false);
    expect(useDeveloperToolsStore.getState().on).toBe(false);
    unbind();
    unbind = null;
    expect(developerTools.bound()).toBe(false);
    expect(developerTools.set(true)).toBe(false);
  });

  it('gives back the binding it replaced when a later one is removed', () => {
    const first = { get: () => true, set: noop, subscribe: () => noop };
    const removeFirst = bindDeveloperTools(first);
    const removeSecond = bindDeveloperTools({ get: () => false, set: noop, subscribe: () => noop });
    expect(useDeveloperToolsStore.getState().on).toBe(false);
    removeSecond();
    expect(useDeveloperToolsStore.getState()).toMatchObject({ binding: first, on: true });
    removeFirst();
    expect(useDeveloperToolsStore.getState().binding).toBeNull();
  });
});

describe('turning developer tools off', () => {
  it('hides Widgets > Developer and closes open dev widgets, the dev kit and popped dev windows, and on brings the submenu back', () => {
    const store = settingsStore();
    unbind = bindDeveloperTools(developerToolsFromSettings('contributing.developerTools')(store));
    mount(store);
    widgets.open('clock');
    widgets.open('trace');
    widgets.popOut('probe');
    expect(seen.on).toBe(true);
    expect(seen.menu).toContain(WIDGETS_DEVELOPER_KEY);
    expect(useWidgetLayoutStore.getState().layout.popped.map((p) => p.id)).toEqual(['probe']);
    act(() => widgetKits.open('inspect'));
    expect(widgetKits.active()).toBe('inspect');

    switchTo(store, false);
    const { layout } = useWidgetLayoutStore.getState();
    expect(seen.on).toBe(false);
    expect(seen.menu).not.toContain(WIDGETS_DEVELOPER_KEY);
    expect(widgetKits.active()).toBeNull();
    expect(isWidgetOpen(layout, 'trace')).toBe(false);
    expect(layout.popped).toEqual([]);
    expect(isWidgetOpen(layout, 'clock')).toBe(true);

    switchTo(store, true);
    expect(seen.menu).toContain(WIDGETS_DEVELOPER_KEY);
    expect(isWidgetOpen(useWidgetLayoutStore.getState().layout, 'probe')).toBe(false);
  });

  it('lets the bound setting decide even in a development run, where tools are on by default', () => {
    const store = settingsStore();
    store.getState().patch({ contributing: { developerTools: false } });
    mount(store);
    expect(seen.on).toBe(true);
    act(() => { unbind = bindDeveloperTools(developerToolsFromSettings('contributing.developerTools')(store)); });
    expect(seen.on).toBe(false);
  });
});
