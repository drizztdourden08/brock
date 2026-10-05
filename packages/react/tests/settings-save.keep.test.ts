/* @layer renderer-shell @kind test */
import { describe, expect, it, vi } from 'vitest';
import type { ToastInput } from '@drizztdourden08/tessera/composites';
import { watchSaveFailures } from '../src/app/BrockApp/behavior/watch-save-failures';
import { createSettingsStore } from '../src/stores/create-settings-store';

const raised = vi.hoisted((): ToastInput[] => []);

vi.mock('@drizztdourden08/tessera/composites', async (original) => ({
  ...await original<object>(),
  toast: Object.assign((input: ToastInput) => { raised.push(input); return 'shown'; }, { dismiss: () => undefined, clear: () => undefined }),
}));

const DEFAULTS = { volume: 0.5 };

const storeWith = (save: (profileId: string, settings: typeof DEFAULTS) => Promise<void>) =>
  createSettingsStore({ defaults: DEFAULTS, load: () => Promise.resolve(null), save, saveDelayMs: 1 });

describe('settings saves', () => {
  it('marks a write as saved', async () => {
    const store = storeWith(() => Promise.resolve());
    await store.getState().hydrate('p1');
    store.getState().patch({ volume: 0.7 });
    await store.flush();
    expect(store.getState()).toMatchObject({ saveStatus: 'saved', saveError: null });
    expect(store.getState().savedAt).not.toBeNull();
  });

  it('reports a failed write and retries it', async () => {
    const save = vi.fn().mockRejectedValueOnce(new Error('disk full')).mockResolvedValue(undefined);
    const store = storeWith(save);
    await store.getState().hydrate('p1');
    store.getState().patch({ volume: 0.9 });
    await store.flush();
    expect(store.getState()).toMatchObject({ saveStatus: 'failed', saveError: 'disk full' });
    await store.getState().retrySave();
    expect(save).toHaveBeenLastCalledWith('p1', { volume: 0.9 });
    expect(store.getState().saveStatus).toBe('saved');
  });

  it('offers Retry on the danger toast of a failed save, and Retry saves again', async () => {
    raised.splice(0);
    const save = vi.fn().mockRejectedValueOnce(new Error('disk full')).mockResolvedValue(undefined);
    const store = storeWith(save);
    const stop = watchSaveFailures(store);
    await store.getState().hydrate('p1');
    store.getState().patch({ volume: 0.3 });
    await store.flush();
    const [shown] = raised;
    expect(shown).toMatchObject({ variant: 'danger', duration: 0, message: 'Settings not saved: disk full.', action: { label: 'Retry' } });
    shown?.action?.onSelect();
    await vi.waitFor(() => expect(store.getState().saveStatus).toBe('saved'));
    expect(save).toHaveBeenCalledTimes(2);
    stop();
  });
});
