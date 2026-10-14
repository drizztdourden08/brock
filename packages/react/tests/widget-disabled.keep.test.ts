/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { WidgetDisabledState } from '@drizztdourden08/tessera/composites';
import { defineWidget } from '../src/widgets/define-widget';
import { useDisabledWidgets } from '../src/widgets/WidgetHost/behavior/useDisabledWidgets';
import type { WidgetDisabledHook } from '../src/widgets/WidgetHost/WidgetHost.type';
import type { WidgetDef } from '../src/widgets/widget.type';
import { openSettingTarget } from '../src/search/open-setting-target';

const opened = vi.hoisted(() => ({ routes: [] as string[], anchors: [] as string[] }));

vi.mock('../src/navigation/nav', () => ({ nav: { open: (route: string) => { opened.routes.push(route); } } }));
vi.mock('../src/search/scroll-to-anchor', () => ({ scrollToAnchor: (anchor: string) => { opened.anchors.push(anchor); } }));

afterEach(() => {
  opened.routes.length = 0;
  opened.anchors.length = 0;
});

const ENGINE_OFF: WidgetDisabledState = { message: 'Start the engine to see the room', settingId: 'game/engine#engine.autoStart' };

const useEngineDisabled: WidgetDisabledHook = () => (id) => (id === 'room' ? ENGINE_OFF : null);

const ROOM = defineWidget({ id: 'room', label: 'Room', render: () => null });
const NOTES = defineWidget({ id: 'notes', label: 'Notes', render: () => null });

const resolverOf = (hook?: WidgetDisabledHook): ((definition: WidgetDef) => WidgetDisabledState | null) => {
  const found: { resolve: ((definition: WidgetDef) => WidgetDisabledState | null) | null } = { resolve: null };
  const Probe = () => {
    found.resolve = useDisabledWidgets(hook);
    return null;
  };
  renderToStaticMarkup(createElement(Probe));
  if (!found.resolve) throw new Error('the probe did not render');
  return found.resolve;
};

describe('the widget disabled hook of WidgetHost', () => {
  it('asks the app hook each render and answers Tessera per widget', () => {
    const resolve = resolverOf(useEngineDisabled);
    expect(resolve(ROOM)).toEqual(ENGINE_OFF);
    expect(resolve(NOTES)).toBeNull();
  });

  it('leaves every widget enabled without a hook', () => {
    expect(resolverOf()(ROOM)).toBeNull();
  });

  it('opens the setting a disabled widget names: a route, then the row after #', () => {
    openSettingTarget('game/engine#engine.autoStart');
    openSettingTarget('settings');
    expect(opened.routes).toEqual(['game/engine', 'settings']);
    expect(opened.anchors).toEqual(['engine.autoStart']);
  });
});
