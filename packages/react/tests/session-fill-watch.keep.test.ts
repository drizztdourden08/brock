/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { tasksBeforeSettings } from '../src/boot/tasks-before-settings';
import { watchSessionFills } from '../src/boot/watch-session-fills';
import { createSessionStore } from '../src/stores/create-session-store';
import { resetAllSessionStores } from '../src/stores/reset-all-session-stores';

const tasks = [
  { id: 'profiles' },
  { id: 'settings', after: ['profiles'] },
  { id: 'fonts' },
  { id: 'welcome', after: ['profiles'] },
  { id: 'sessions', after: ['settings'] },
  { id: 'runs', after: ['sessions'] },
  { id: 'loose' },
];

let stop: (() => void) | null = null;

afterEach(() => {
  stop?.();
  stop = null;
});

describe('tasksBeforeSettings', () => {
  it('names the app tasks with no settings in their after chain', () => {
    expect(tasksBeforeSettings(tasks)).toEqual(['welcome', 'loose']);
  });

  it('survives a cycle', () => {
    expect(tasksBeforeSettings([{ id: 'a', after: ['b'] }, { id: 'b', after: ['a'] }])).toEqual(['a', 'b']);
  });
});

describe('watchSessionFills', () => {
  it('warns when the profile reset wipes a filled session store, naming the suspects', () => {
    const store = createSessionStore<{ runs: string[] }>(() => ({ runs: [] }));
    const warn = vi.fn();
    stop = watchSessionFills(tasks, warn);
    resetAllSessionStores();
    expect(warn).not.toHaveBeenCalled();
    store.setState({ runs: ['first'] });
    resetAllSessionStores();
    expect(store.getState().runs).toEqual([]);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toMatch(/welcome, loose.*after: \['settings'\]/);
  });

  it('stays quiet once the boot is over', () => {
    const store = createSessionStore<{ count: number }>(() => ({ count: 0 }));
    const warn = vi.fn();
    watchSessionFills(tasks, warn)();
    store.setState({ count: 2 });
    resetAllSessionStores();
    expect(warn).not.toHaveBeenCalled();
  });
});
