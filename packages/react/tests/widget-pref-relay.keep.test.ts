/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import type { WidgetPrefsWire } from '@drizztdourden08/brock-core';
import { useWidgetPrefStore } from '../src/stores/useWidgetPrefStore';
import { relayWidgetPrefs } from '../src/widgets/relay-widget-prefs';

const prefs = () => useWidgetPrefStore.getState();

const recorder = () => {
  const sent: [string, WidgetPrefsWire][] = [];
  return { sent, send: (id: string, next: WidgetPrefsWire) => { sent.push([id, next]); } };
};

describe('relayWidgetPrefs', () => {
  const stops: (() => void)[] = [];

  afterEach(() => {
    for (const stop of stops.splice(0)) stop();
    prefs().hydrate({});
  });

  it('sends a pref changed in the popped window, for its own widget only', () => {
    const { sent, send } = recorder();
    stops.push(relayWidgetPrefs('logs', send).stop);
    prefs().setPref('logs', 'hiddenLevels', ['info']);
    prefs().setPref('notes', 'wrap', true);
    expect(sent).toEqual([['logs', { hiddenLevels: ['info'] }]]);
  });

  it('does not echo the prefs the app relays back', () => {
    const { sent, send } = recorder();
    const relay = relayWidgetPrefs('logs', send);
    stops.push(relay.stop);
    relay.receive({ logs: { hiddenLevels: ['warn'] } });
    expect(prefs().byWidget.logs).toEqual({ hiddenLevels: ['warn'] });
    expect(sent).toEqual([]);
  });

  it('lands in the app store as that widget prefs, leaving the others', () => {
    const { sent, send } = recorder();
    stops.push(relayWidgetPrefs('logs', send).stop);
    prefs().setPref('logs', 'hiddenLevels', ['error']);
    const [[id, next] = ['', {}]] = sent;
    prefs().hydrate({ notes: { wrap: true } });
    prefs().replaceWidget(id, next);
    expect(prefs().byWidget).toEqual({ notes: { wrap: true }, logs: { hiddenLevels: ['error'] } });
  });
});
