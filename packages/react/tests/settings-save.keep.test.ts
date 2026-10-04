/* @layer renderer-shell @kind test */
import { describe, expect, it, vi } from 'vitest';
import { createSettingsStore } from '../src/stores/create-settings-store';

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
});
