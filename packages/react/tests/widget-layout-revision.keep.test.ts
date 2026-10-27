/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { widgetsIn } from '@drizztdourden08/tessera/composites';
import type { ToastCloseReason } from '@drizztdourden08/tessera/composites';
import type { LayoutPreset } from '../src/widgets/layout-preset.type';
import { fakeDisk, settle } from './fake-ui-views-disk';

interface RaisedToast {
  message: string;
  options: { action?: { label: string; onSelect: () => void }; onClose?: (reason: ToastCloseReason) => void; duration?: number };
}

const raised = vi.hoisted((): RaisedToast[] => []);

vi.mock('../src/toast', () => ({
  toast: (message: string, options: RaisedToast['options'] = {}) => {
    raised.push({ message, options });
    return `toast-${raised.length}`;
  },
}));

const OLD: LayoutPreset = { rows: [['log'], ['main']] };
const NEWER: LayoutPreset = { rows: [['log', 'hints'], ['main']], revision: 2 };

const startApp = async (preset: LayoutPreset) => {
  vi.resetModules();
  const { widgetPersistence } = await import('../src/widgets/widget-persistence');
  const { useWidgetLayoutStore } = await import('../src/widgets/useWidgetLayoutStore');
  const { defineWidget } = await import('../src/widgets/define-widget');
  const definitions = ['log', 'hints'].map((id) => defineWidget({ id, label: id, render: () => null }));
  useWidgetLayoutStore.getState().setDefinitions(definitions);
  useWidgetLayoutStore.getState().setPreset(preset);
  const stop = widgetPersistence.watch();
  return { widgetPersistence, layout: () => useWidgetLayoutStore.getState().layout, stop };
};

const savedProfile = async () => {
  const disk = fakeDisk({});
  const first = await startApp(OLD);
  await first.widgetPersistence.load('p1');
  const store = (await import('../src/widgets/useWidgetLayoutStore')).useWidgetLayoutStore;
  store.getState().open('hints');
  await settle();
  first.stop();
  return { ...disk, saved: first.layout() };
};

const flushed = async (listeners: Map<string, () => void>) => {
  await settle();
  listeners.get('pagehide')?.();
  await settle();
};

const profile = (disk: { file: Record<string, unknown> }) => disk.file['profile:p1'] as Record<string, unknown>;

afterEach(() => {
  raised.length = 0;
  vi.unstubAllGlobals();
});

describe('layout preset revision', { timeout: 60_000 }, () => {
  it('records the preset revision with a layout saved from it', async () => {
    const { disk } = await savedProfile();
    expect(profile(disk).widgetLayoutRevision).toBe(1);
    expect(raised).toEqual([]);
  });

  it('offers the new layout once when the preset revision is newer', async () => {
    const { disk, saved } = await savedProfile();
    const next = await startApp(NEWER);
    await next.widgetPersistence.load('p1');
    expect(next.layout()).toEqual(saved);
    expect(raised).toHaveLength(1);
    expect(raised[0]?.options).toMatchObject({ duration: 0, action: { label: 'Reset' } });
    expect(profile(disk).widgetLayoutRevision).toBe(1);
  });

  it('does not offer when the revision is the same or older', async () => {
    await savedProfile();
    const same = await startApp({ ...OLD, revision: 1 });
    await same.widgetPersistence.load('p1');
    const older = await startApp({ ...OLD, revision: 0 });
    await older.widgetPersistence.load('p1');
    expect(raised).toEqual([]);
  });

  it('counts a saved layout with no recorded revision as revision 1', async () => {
    const { disk } = await savedProfile();
    const { widgetLayoutRevision: _gone, ...rest } = profile(disk);
    disk.file['profile:p1'] = rest;
    const same = await startApp(OLD);
    await same.widgetPersistence.load('p1');
    expect(raised).toEqual([]);
    const newer = await startApp(NEWER);
    await newer.widgetPersistence.load('p1');
    expect(raised).toHaveLength(1);
  });

});

describe('answering the layout revision notice', { timeout: 60_000 }, () => {
  it('keeps the layout and stores the new revision when the notice is closed, so it does not ask again', async () => {
    const { disk, saved, listeners } = await savedProfile();
    const next = await startApp(NEWER);
    await next.widgetPersistence.load('p1');
    raised[0]?.options.onClose?.('dismissed');
    await flushed(listeners);
    expect(profile(disk).widgetLayoutRevision).toBe(2);
    expect(next.layout()).toEqual(saved);
    raised.length = 0;
    const again = await startApp(NEWER);
    await again.widgetPersistence.load('p1');
    expect(raised).toEqual([]);
  });

  it('resets to the new layout from the Reset action and records the revision with it', async () => {
    const { disk, listeners } = await savedProfile();
    const next = await startApp(NEWER);
    await next.widgetPersistence.load('p1');
    raised[0]?.options.action?.onSelect();
    raised[0]?.options.onClose?.('action');
    await flushed(listeners);
    expect(widgetsIn(next.layout().dock)).toEqual(['log', 'hints']);
    expect(profile(disk).widgetLayoutRevision).toBe(2);
    raised.length = 0;
    const again = await startApp(NEWER);
    await again.widgetPersistence.load('p1');
    expect(raised).toEqual([]);
  });

  it('applies the new layout directly with onRevision apply and offers nothing', async () => {
    const { disk, listeners } = await savedProfile();
    const next = await startApp({ ...NEWER, onRevision: 'apply' });
    await next.widgetPersistence.load('p1');
    await flushed(listeners);
    expect(raised).toEqual([]);
    expect(widgetsIn(next.layout().dock)).toEqual(['log', 'hints']);
    expect(profile(disk).widgetLayoutRevision).toBe(2);
  });

  it('starts a profile with no saved layout from the preset and records its revision on the first save', async () => {
    const disk = fakeDisk({});
    const first = await startApp(NEWER);
    await first.widgetPersistence.load('p1');
    expect(raised).toEqual([]);
    const { useWidgetLayoutStore } = await import('../src/widgets/useWidgetLayoutStore');
    useWidgetLayoutStore.getState().close('hints');
    await flushed(disk.listeners);
    expect(profile(disk.disk).widgetLayoutRevision).toBe(2);
  });
});
