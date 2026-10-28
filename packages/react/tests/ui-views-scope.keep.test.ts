/* @layer renderer-shell @kind test */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { fakeMain } from './ui-views-fake-main';

const freshModules = async () => {
  vi.resetModules();
  const { uiViews } = await import('../src/stores/ui-views');
  const { useScopedStateStore } = await import('../src/stores/useScopedStateStore');
  return { uiViews, useScopedStateStore };
};

beforeAll(async () => {
  await import('../src/stores/useScopedStateStore');
}, 60_000);

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('scoped state', () => {
  it('comes back after a reload of the store, for the same scope only', async () => {
    const disk = fakeMain();
    const first = await freshModules();
    await first.useScopedStateStore.getState().load('project:a');
    first.useScopedStateStore.getState().setValue('project:a', 'sprites/zoom', 4);
    first.useScopedStateStore.getState().setValue('project:b', 'sprites/zoom', 1);
    await vi.waitFor(async () => expect(await first.uiViews.scope('project:b').read('sprites/zoom', 0)).toBe(1));
    expect(await first.uiViews.scope('project:a').read('sprites/zoom', 0)).toBe(4);
    first.uiViews.flush();
    expect(Object.keys(disk.file).sort()).toEqual(['scope:project:a', 'scope:project:b']);

    const second = await freshModules();
    await second.useScopedStateStore.getState().load('project:a');
    expect(second.useScopedStateStore.getState().values['project:a']).toEqual({ 'sprites/zoom': 4 });
    expect(second.useScopedStateStore.getState().values['project:b']).toBeUndefined();
  });

  it('keeps a value set before the first load finished', async () => {
    fakeMain({ 'scope:doc': { at: 1, order: ['pan'], values: { pan: 1 } } });
    const { useScopedStateStore } = await freshModules();
    const loading = useScopedStateStore.getState().load('doc');
    useScopedStateStore.getState().setValue('doc', 'pan', 9);
    await loading;
    expect(useScopedStateStore.getState().values.doc).toEqual({ pan: 9 });
  });

  it('keeps the keys the app owns apart from scopes', async () => {
    fakeMain();
    const { uiViews } = await freshModules();
    await expect(uiViews.write('scope:project:a', {})).rejects.toThrow(/uiViews\.scope/);
    expect(() => uiViews.scope('')).toThrow(/needs a key/);
  });
});

describe('the scope size cap', () => {
  it('evicts the oldest written name once a scope holds more than its cap', async () => {
    const disk = fakeMain();
    const { uiViews } = await freshModules();
    const scope = uiViews.scope('project:a', { maxKeys: 3 });
    for (const name of ['a', 'b', 'c']) await scope.write(name, name.toUpperCase());
    await scope.write('a', 'A2');
    await scope.write('d', 'D');
    expect(await scope.readAll()).toEqual({ a: 'A2', c: 'C', d: 'D' });
    uiViews.flush();
    expect((disk.file['scope:project:a'] as { order: string[] }).order).toEqual(['c', 'a', 'd']);
  });

  it('uses the configured default and refuses a cap that is not a whole number', async () => {
    fakeMain();
    const { uiViews } = await freshModules();
    expect(uiViews.scopeLimits({ maxKeys: 2 })).toMatchObject({ maxKeys: 2 });
    const scope = uiViews.scope('doc');
    for (const name of ['a', 'b', 'c']) await scope.write(name, 1);
    expect(Object.keys(await scope.readAll())).toEqual(['b', 'c']);
    expect(() => uiViews.scopeLimits({ maxScopes: 0 })).toThrow(/at least 1/);
    expect(() => uiViews.scopeLimits({ maxKeys: 1.5 })).toThrow(/whole number/);
  });

  it('drops the scope written longest ago once there are more scopes than the cap', async () => {
    const disk = fakeMain();
    const { uiViews } = await freshModules();
    uiViews.scopeLimits({ maxScopes: 2 });
    await uiViews.scope('one').write('x', 1);
    await uiViews.scope('two').write('x', 2);
    await uiViews.scope('one').write('y', 1);
    await uiViews.scope('three').write('x', 3);
    uiViews.flush();
    expect(Object.keys(disk.file).sort()).toEqual(['scope:one', 'scope:three']);
  });

  it('serialises quick writes so none is lost', async () => {
    fakeMain();
    const { uiViews } = await freshModules();
    const scope = uiViews.scope('doc');
    await Promise.all([scope.write('a', 1), scope.write('b', 2), scope.write('c', 3)]);
    expect(await scope.readAll()).toEqual({ a: 1, b: 2, c: 3 });
  });
});
