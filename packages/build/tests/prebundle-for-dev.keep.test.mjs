/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ count: null, fail: false, bundling: true, calls: 0 }));

vi.mock('../src/import-from-app.mjs', () => ({
  importFromApp: async (_root, name) => (name === 'vite' ? {} : { resolveConfig: async () => ({ config: { renderer: { root: 'r' } } }) }),
}));
vi.mock('../src/optimize-deps/optimize-renderer.mjs', () => ({
  optimizeRenderer: async (_vite, _renderer, onBundling) => {
    state.calls += 1;
    if (state.fail) throw new Error('boom');
    if (state.bundling) onBundling();
    return state.count;
  },
}));

const { prebundleForDev } = await import('../src/commands/prebundle-for-dev.mjs');

afterEach(() => {
  vi.restoreAllMocks();
  Object.assign(state, { count: null, fail: false, bundling: true, calls: 0 });
});

const run = async () => {
  const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  await prebundleForDev('app');
  return { lines: log.mock.calls.map(([line]) => line).join('\n'), warned: warn.mock.calls.map(([line]) => line).join('\n') };
};

describe('K1 prebundleForDev', { tags: ['critical'] }, () => {
  it('says it is pre-bundling and reports the count when deps are missing', async () => {
    state.count = 600;
    const { lines } = await run();
    expect(lines).toContain('pre-bundling renderer dependencies before the window opens');
    expect(lines).toContain('600 renderer dependencies pre-bundled');
  });

  it('prints nothing when the deps are already in place', async () => {
    state.bundling = false;
    const { lines, warned } = await run();
    expect(state.calls).toBe(1);
    expect(lines).toBe('');
    expect(warned).toBe('');
  });

  it('warns once and resolves when the pre-bundle throws, so dev still starts', async () => {
    state.fail = true;
    const { warned } = await run();
    expect(warned).toContain('the dev server will do it: boom');
  });
});
