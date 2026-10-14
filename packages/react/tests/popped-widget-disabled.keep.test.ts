/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Widget } from '@drizztdourden08/tessera/composites';
import type { WidgetDisabledHook } from '../src/widgets/WidgetHost/WidgetHost.type';
import { useWidgetRelayPublisher } from '../src/widgets/WidgetHost/behavior/useWidgetRelayPublisher';
import { useWidgetLayoutStore } from '../src/widgets/useWidgetLayoutStore';
import { usePoppedDisabled } from '../src/widgets/WidgetWindow/behavior/usePoppedDisabled';
import { defineWidget } from '../src/widgets/define-widget';

const opened = vi.hoisted(() => [] as string[]);

vi.mock('../src/search/open-setting-target', () => ({ openSettingTarget: (target: string) => { opened.push(target); } }));

const NOTES = defineWidget({ id: 'notes', label: 'Notes', render: () => null });

const OFF: WidgetDisabledHook = () => (id) => (id === 'notes' ? { message: 'Turn on notes first', settingId: 'general#notes.enabled' } : null);

const ON: WidgetDisabledHook = () => () => null;

let root: Root | null = null;

const fakeHost = () => {
  const asked: string[] = [];
  const listeners = new Set<(target: string) => void>();
  const api = {
    publishWidgetSlice: () => undefined,
    onWidgetSnapshotRequest: () => () => undefined,
    onWidgetSettingsPatch: () => () => undefined,
    openWidgetSetting: (target: string) => { asked.push(target); },
    onWidgetSettingTarget: (fn: (target: string) => void) => {
      listeners.add(fn);
      return () => { listeners.delete(fn); };
    },
  };
  Object.assign(window, { api });
  return { asked, listeners };
};

const Popped = (props: { hook: WidgetDisabledHook }) => {
  const off = usePoppedDisabled(NOTES, props.hook);
  return createElement(Widget, {
    id: 'notes', tabs: [{ id: 'notes', label: 'Notes' }], activeId: 'notes', paneKey: null, mode: 'out', opacity: 1,
    onActivateTab: () => undefined, onPopOut: () => undefined, onClose: () => undefined, disabled: off.disabled, onOpenSettings: off.onOpenSettings,
    children: createElement('p', { className: 'notes-body' }, 'Body'),
  });
};

const MainWindow = () => {
  useWidgetRelayPublisher(null);
  return null;
};

const draw = (element: ReturnType<typeof createElement>): void => {
  document.body.innerHTML = '<div id="host"></div>';
  root = createRoot(document.getElementById('host') as HTMLElement);
  act(() => root?.render(element));
};

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  document.body.replaceChildren();
  Reflect.deleteProperty(window, 'api');
  opened.length = 0;
});

describe('a disabled widget in its own window', () => {
  it('covers the body with the reason from widgetDisabled, and Open Settings asks the main window for the setting', () => {
    const host = fakeHost();
    draw(createElement(Popped, { hook: OFF }));
    expect(document.querySelector('.disabled-overlay__message')?.textContent).toBe('Turn on notes first');
    expect(document.querySelector('.disabled-overlay__content')?.getAttribute('aria-disabled')).toBe('true');
    const button = [...document.querySelectorAll('button')].find((element) => element.textContent === 'Open Settings');
    act(() => button?.click());
    expect(host.asked).toEqual(['general#notes.enabled']);
  });

  it('draws the body as usual while the hook leaves the widget on', () => {
    fakeHost();
    draw(createElement(Popped, { hook: ON }));
    expect(document.querySelector('.disabled-overlay')).toBeNull();
    expect(document.querySelector('.notes-body')?.textContent).toBe('Body');
  });

  it('opens the setting a widget window asks for in the main window, while a widget is popped', () => {
    const host = fakeHost();
    const { layout } = useWidgetLayoutStore.getState();
    useWidgetLayoutStore.setState({ layout: { ...layout, popped: [{ id: 'notes' }] } });
    draw(createElement(MainWindow));
    expect(host.listeners.size).toBe(1);
    for (const fn of host.listeners) fn('general#notes.enabled');
    expect(opened).toEqual(['general#notes.enabled']);
    act(() => root?.unmount());
    root = null;
    expect(host.listeners.size).toBe(0);
    useWidgetLayoutStore.setState({ layout });
  });
});
