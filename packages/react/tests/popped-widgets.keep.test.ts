/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { createDefaultLayout } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { createSettingsStore } from '../src/stores/create-settings-store';
import { useProfilesStore } from '../src/stores/useProfilesStore';
import { defineWidget } from '../src/widgets/define-widget';
import { poppedShown } from '../src/widgets/popped-shown';
import { poppedWindows } from '../src/widgets/popped-windows';
import { relayWidgetSettings } from '../src/widgets/relay-widget-settings';
import { useWidgetRelayStore } from '../src/widgets/useWidgetRelayStore';

const definitions = [
  defineWidget({ id: 'tools', label: 'Tools', render: () => null, popOut: true, devOnly: true }),
  defineWidget({ id: 'radar', label: 'Radar', render: () => null, popOut: true, defaultVisibility: 'context-only' }),
  defineWidget({ id: 'pinned', label: 'Pinned', render: () => null }),
];

const layout: WidgetLayout = {
  ...createDefaultLayout(),
  popped: [{ id: 'tools', bounds: { x: 1, y: 2, width: 300, height: 200 } }, { id: 'radar' }, { id: 'pinned' }],
};

const gates = { definitions, developerToolsEnabled: true, contextActive: true, pageOpen: false, forcedIds: [], contentIds: definitions.map((d) => d.id) };
const shownIds = (over: Partial<typeof gates>) => poppedShown(layout, { ...gates, ...over }).map((p) => p.id);

describe('poppedShown', () => {
  it('shows every popped widget that may pop out while every gate is open', () => {
    expect(shownIds({})).toEqual(['tools', 'radar']);
  });

  it('hides a devOnly widget once developer tools are off, keeping its memory in the layout', () => {
    expect(shownIds({ developerToolsEnabled: false })).toEqual(['radar']);
    expect(layout.popped[0]?.bounds).toEqual({ x: 1, y: 2, width: 300, height: 200 });
  });

  it('hides a context-only widget over a page or outside its context', () => {
    expect(shownIds({ pageOpen: true })).toEqual(['tools']);
    expect(shownIds({ contextActive: false })).toEqual(['tools']);
  });

  it('follows the frame show over the definition default', () => {
    const shown = poppedShown({ ...layout, frame: { radar: { opacity: 1, show: 'always' } } }, { ...gates, pageOpen: true });
    expect(shown.map((p) => p.id)).toEqual(['tools', 'radar']);
  });
});

describe('poppedWindows', () => {
  it('accepts only the close of the window it opened last', () => {
    poppedWindows.open({ id: 'tools' });
    expect(poppedWindows.isOpen('tools')).toBe(true);
    expect(poppedWindows.settle('tools', -1)).toBe(false);
    poppedWindows.sync([], () => ({}));
    expect(poppedWindows.settle('tools', undefined)).toBe(false);
    poppedWindows.open({ id: 'tools' });
    expect(poppedWindows.settle('tools', undefined)).toBe(true);
    expect(poppedWindows.isOpen('tools')).toBe(false);
  });
});

describe('the widget relay store', () => {
  it('appends log increments up to the limit', () => {
    const relay = useWidgetRelayStore.getState();
    relay.receive('log', [1, 2]);
    relay.append('log', [3, 4], 3);
    expect(useWidgetRelayStore.getState().slices.log).toEqual([2, 3, 4]);
  });
});

describe('relayWidgetSettings', () => {
  const store = createSettingsStore<{ theme: string; volume: number }>({
    defaults: { theme: 'dark', volume: 1 }, load: () => Promise.resolve(null), save: () => Promise.resolve(),
  });

  afterEach(() => useProfilesStore.getState().setActive(null));

  it('takes the relayed profile and settings without echoing them, and sends local changes back', () => {
    const sent: Record<string, unknown>[] = [];
    const relay = relayWidgetSettings(store, (patch) => { sent.push(patch); });
    const profile = { id: 'p1', name: 'One', created: 0, lastPlayed: 0 };
    relay.receive({ profile, settings: { theme: 'light', volume: 0.5 } });
    expect(store.getState().settings).toEqual({ theme: 'light', volume: 0.5 });
    expect(useProfilesStore.getState().active?.id).toBe('p1');
    expect(sent).toEqual([]);
    store.getState().patch({ volume: 0.2 });
    expect(sent).toEqual([{ volume: 0.2 }]);
    relay.stop();
  });
});
