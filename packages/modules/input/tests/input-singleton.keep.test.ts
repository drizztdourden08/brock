/* @layer electron-main @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MainContext } from '@drizztdourden08/brock-electron/main';

const runtimes: { source: { start: ReturnType<typeof vi.fn>; refresh: ReturnType<typeof vi.fn> } }[] = [];

vi.mock('@drizztdourden08/brock-electron/context', () => ({
  memoByContext: <T>(create: (ctx: MainContext) => T) => {
    const memo = new WeakMap<object, T>();
    return (ctx: MainContext): T => {
      const found = memo.get(ctx.files) ?? create(ctx);
      memo.set(ctx.files, found);
      return found;
    };
  },
}));
vi.mock('../src/main/create-input-runtime', () => ({
  createInputRuntime: vi.fn(() => {
    const runtime = {
      mappings: { load: vi.fn(() => Promise.resolve()) },
      source: { start: vi.fn(), stop: vi.fn(), refresh: vi.fn(() => []), snapshot: vi.fn(() => [{ deviceKey: 'cached' }]) },
      haptics: { cancelAll: vi.fn() },
      status: () => ({ available: true, sdlVersion: '3.0.0' }),
    };
    runtimes.push(runtime);
    return runtime;
  }),
}));
vi.mock('../src/main/pad-gate', () => ({ createPadGate: () => ({ claim: () => true, release: vi.fn() }) }));
vi.mock('../src/calibration/calibration-store', () => ({ createCalibrationStore: () => ({}) }));

const { default: inputMain, getInput } = await import('../src/main/index');
const { createInputRuntime } = await import('../src/main/create-input-runtime');

const contextWith = (): MainContext => {
  const partial: Partial<MainContext> = {
    flags: { flags: [], isAutomationLaunch: () => false, isHeadlessLaunch: () => false, flagValue: () => null, hasFlag: () => false },
    paths: { userData: () => 'u', data: () => 'd' },
    files: {} as MainContext['files'],
    handle: vi.fn(),
    log: vi.fn(),
  };
  return partial as MainContext;
};

describe('input module context', () => {
  beforeEach(() => { runtimes.length = 0; vi.mocked(createInputRuntime).mockClear(); });

  it('gives register (a copy of the context) and onWindow (the original) the same InputMain', async () => {
    const ctx = contextWith();
    const copy = { ...ctx };

    await inputMain.register(copy);
    inputMain.onWindow?.({} as never, ctx);
    await getInput(ctx).start();

    expect(getInput(copy)).toBe(getInput(ctx));
    expect(createInputRuntime).toHaveBeenCalledTimes(1);
    expect(runtimes).toHaveLength(1);
    expect(runtimes[0]?.source.start).toHaveBeenCalledTimes(1);
  });

  it('serves input:list from the runtime that onWindow started', async () => {
    const ctx = contextWith();
    await inputMain.register({ ...ctx });
    inputMain.onWindow?.({} as never, ctx);
    const list = vi.mocked(ctx.handle).mock.calls.find(([channel]) => channel === 'input:list')?.[1] as () => Promise<unknown>;
    expect(await list()).toEqual([{ deviceKey: 'cached' }]);

    expect(runtimes).toHaveLength(1);
    expect(runtimes[0]?.source.refresh).not.toHaveBeenCalled();
    expect(runtimes[0]?.source.start).toHaveBeenCalledTimes(1);
  });
});
