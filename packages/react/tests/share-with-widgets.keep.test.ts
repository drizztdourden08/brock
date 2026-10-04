/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { create } from 'zustand';
import type { WidgetSlice } from '@drizztdourden08/brock-core';
import { useProfilesStore } from '../src/stores/useProfilesStore';
import { defineWidget } from '../src/widgets/define-widget';
import { shareWithWidgets } from '../src/widgets/share-with-widgets';
import { useWidgetLayoutStore } from '../src/widgets/useWidgetLayoutStore';
import { useWidgetRelayStore } from '../src/widgets/useWidgetRelayStore';
import { useWidgetSlice } from '../src/widgets/useWidgetSlice';

interface Session {
  room: string;
  lines: string[];
  typing: boolean;
}

const KIND = 'demo:session';
const ROOM = defineWidget({ id: 'room', label: 'Room', render: () => null, popOut: true });
const PROFILE = { id: 'p2', name: 'Second', createdAt: 0 } as never;

const fakeHost = (search = '') => {
  const sent: WidgetSlice[] = [];
  const snapshot: { request: (() => void) | null } = { request: null };
  const api = {
    publishWidgetSlice: (slice: WidgetSlice) => { sent.push(slice); },
    onWidgetSnapshotRequest: (fn: () => void) => {
      snapshot.request = fn;
      return () => { snapshot.request = null; };
    },
  };
  vi.stubGlobal('window', { api, location: { search } });
  return { sent, snapshot };
};

const sessionStore = () => create<Session>()(() => ({ room: 'Lobby', lines: [], typing: false }));
const pick = ({ room, lines }: Session) => ({ room, lines });

describe('shareWithWidgets', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useWidgetLayoutStore.getState().setDefinitions([ROOM]);
    useWidgetLayoutStore.getState().replace(null);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    useWidgetRelayStore.setState({ slices: {} });
  });

  it('keeps the picked slice in the main window for docked widgets, with no traffic while nothing is popped', () => {
    const { sent } = fakeHost();
    const store = sessionStore();
    const stop = shareWithWidgets(store, { kind: KIND, pick });
    store.setState({ room: 'Hall' });
    vi.runAllTimers();
    expect(useWidgetRelayStore.getState().slices[KIND]).toEqual({ room: 'Hall', lines: [] });
    expect(sent).toEqual([]);
    stop();
  });

  it('debounces changes into one publish while a widget is popped, and skips changes outside the pick', () => {
    const { sent } = fakeHost();
    const store = sessionStore();
    const stop = shareWithWidgets(store, { kind: KIND, pick });
    useWidgetLayoutStore.getState().popOut('room');
    store.setState({ typing: true });
    store.setState({ room: 'Hall' });
    store.setState({ lines: ['hi'] });
    expect(sent).toEqual([]);
    vi.runAllTimers();
    expect(sent).toEqual([{ kind: KIND, data: { room: 'Hall', lines: ['hi'] } }]);
    stop();
  });

  it('answers a new window snapshot request and republishes on a profile switch', () => {
    const { sent, snapshot } = fakeHost();
    const stop = shareWithWidgets(sessionStore(), { kind: KIND, pick });
    snapshot.request?.();
    expect(sent).toEqual([{ kind: KIND, data: { room: 'Lobby', lines: [] } }]);
    useWidgetLayoutStore.getState().popOut('room');
    useProfilesStore.setState({ active: PROFILE });
    expect(sent).toHaveLength(2);
    stop();
    expect(snapshot.request).toBeNull();
    useProfilesStore.setState({ active: null });
  });

  it('does nothing in a widget window, which gets the slice through the relay', () => {
    const { sent, snapshot } = fakeHost('?widget=room');
    const stop = shareWithWidgets(sessionStore(), { kind: KIND, pick });
    expect(snapshot.request).toBeNull();
    expect(useWidgetRelayStore.getState().slices[KIND]).toBeUndefined();
    expect(sent).toEqual([]);
    stop();
  });

  it('reads the slice by kind, with the fallback until one arrives', () => {
    const Reader = () => `${useWidgetSlice(KIND, { room: 'Nowhere' }).room} ${String(useWidgetSlice(KIND))}`;
    expect(renderToStaticMarkup(createElement(Reader))).toBe('Nowhere undefined');
  });
});
