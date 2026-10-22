/* @layer electron-main @kind test */
import { describe, expect, it, vi } from 'vitest';
import { registerInputHandlers } from '../src/main/handlers';
import type { InputMain } from '../src/main/input-main.type';

const setup = () => {
  const cached = [{ deviceKey: '045e:02ff' }];
  const fresh = [{ deviceKey: '045e:02ff' }, { deviceKey: '045e:0b13' }];
  const source = {
    snapshot: vi.fn(() => cached),
    refresh: vi.fn(() => fresh),
    listed: vi.fn(() => []),
    rescan: vi.fn(),
  };
  const input = { start: vi.fn(() => Promise.resolve()), runtime: () => ({ source }), calibration: {} } as unknown as InputMain;
  const handlers = new Map<string, (...args: unknown[]) => unknown>();
  const handle = ((channel: string, fn: (...args: unknown[]) => unknown) => { handlers.set(channel, fn); }) as never;
  registerInputHandlers({ handle }, input);
  return { source, input, call: (channel: string) => handlers.get(channel)?.({}) };
};

describe('the input list and refresh verbs', () => {
  it('list returns the cached snapshot and never scans', async () => {
    const { source, input, call } = setup();
    expect(await call('input:list')).toEqual([{ deviceKey: '045e:02ff' }]);
    expect(input.start).toHaveBeenCalledOnce();
    expect(source.snapshot).toHaveBeenCalledOnce();
    expect(source.refresh).not.toHaveBeenCalled();
  });

  it('refresh runs the full scan and returns its result', async () => {
    const { source, call } = setup();
    expect(await call('input:refresh')).toHaveLength(2);
    expect(source.refresh).toHaveBeenCalledOnce();
  });
});
