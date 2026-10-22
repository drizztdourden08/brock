/* @layer electron-main @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MainContext } from '@drizztdourden08/brock-electron/main';

const source = {
  start: vi.fn(),
  stop: vi.fn(),
  snapshot: vi.fn(() => [{ deviceKey: '045e:02ff' }]),
  refresh: vi.fn(() => [{ deviceKey: '045e:02ff' }, { deviceKey: '045e:0b13' }]),
  listed: vi.fn(() => []),
  rescan: vi.fn(),
};

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
  createInputRuntime: () => ({
    mappings: { load: () => Promise.resolve() },
    source,
    haptics: { cancelAll: vi.fn() },
    status: () => ({ available: true, sdlVersion: '3.0.0' }),
  }),
}));
vi.mock('../src/main/pad-gate', () => ({ createPadGate: () => ({ claim: () => true, release: vi.fn() }) }));
vi.mock('../src/calibration/calibration-store', () => ({ createCalibrationStore: () => ({}) }));

const { getInput } = await import('../src/main/input-main');
const { registerInputHandlers } = await import('../src/main/handlers');

const handlersFor = () => {
  const handlers = new Map<string, () => Promise<unknown>>();
  const partial: Partial<MainContext> = {
    flags: { flags: [], isAutomationLaunch: () => false, isHeadlessLaunch: () => false, flagValue: () => null, hasFlag: () => false },
    files: {} as MainContext['files'],
    log: vi.fn(),
    handle: ((channel: string, listener: () => Promise<unknown>) => { handlers.set(channel, listener); }) as MainContext['handle'],
  };
  const ctx = partial as MainContext;
  registerInputHandlers(ctx, getInput(ctx));
  return handlers;
};

describe('the input list and refresh verbs', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('list returns the cached snapshot and never scans', async () => {
    const list = handlersFor().get('input:list');
    expect(await list?.()).toEqual([{ deviceKey: '045e:02ff' }]);
    expect(source.snapshot).toHaveBeenCalledOnce();
    expect(source.refresh).not.toHaveBeenCalled();
  });

  it('refresh runs the full scan and returns its result', async () => {
    const refresh = handlersFor().get('input:refresh');
    expect(await refresh?.()).toHaveLength(2);
    expect(source.refresh).toHaveBeenCalledOnce();
  });
});
