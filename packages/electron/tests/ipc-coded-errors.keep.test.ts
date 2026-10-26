/* @layer electron-main @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppError, isAppError } from '@drizztdourden08/brock-core/ipc';

type Handler = (...args: unknown[]) => Promise<unknown>;

const wired = vi.hoisted(() => ({ handlers: new Map<string, (...args: unknown[]) => Promise<unknown>>() }));

vi.mock('electron', () => ({
  ipcMain: { handle: (channel: string, fn: Handler) => wired.handlers.set(channel, fn) },
  ipcRenderer: {
    invoke: async (channel: string, ...args: unknown[]) => {
      const fn = wired.handlers.get(channel);
      if (fn === undefined) throw new Error(`no handler for ${channel}`);
      try {
        return await fn(undefined, ...args);
      } catch (error) {
        throw new Error(`Error invoking remote method '${channel}': Error: ${(error as Error).message}`, { cause: error });
      }
    },
  },
}));

const { handle } = await import('../src/main/ipc/handle');
const { invokeCoded } = await import('../src/preload/invoke-coded');

const register = (channel: string, fn: () => unknown): void => {
  (handle as (channel: string, fn: () => unknown) => void)(channel, fn);
};

describe('coded errors through ctx.handle and the preload invoke', () => {
  beforeEach(() => wired.handlers.clear());

  it('carries the code and data of a thrown AppError', async () => {
    register('t:coded', () => {
      throw new AppError('Install failed', { code: 'install-failed', data: { step: 'unpack' } });
    });
    const failure = await invokeCoded('t:coded', []).catch((error: unknown) => error);
    expect(isAppError(failure, 'install-failed')).toBe(true);
    expect((failure as AppError).message).toBe('Install failed');
    expect((failure as AppError).data).toEqual({ step: 'unpack' });
  });

  it('carries a code from an async handler', async () => {
    register('t:async', () => Promise.reject(new AppError('Busy', { code: 'busy' })));
    const failure = await invokeCoded('t:async', []).catch((error: unknown) => error);
    expect(isAppError(failure, 'busy')).toBe(true);
  });

  it('keeps a plain error message-only', async () => {
    register('t:plain', () => {
      throw new Error('plain failure');
    });
    const failure = await invokeCoded('t:plain', []).catch((error: unknown) => error);
    expect(isAppError(failure)).toBe(false);
    expect((failure as Error).message).toContain('plain failure');
  });

  it('marks data over the cap as dropped', async () => {
    register('t:big', () => {
      throw new AppError('Big', { code: 'big', data: { blob: 'x'.repeat(9000) } });
    });
    const failure = await invokeCoded('t:big', []).catch((error: unknown) => error);
    expect(isAppError(failure, 'big')).toBe(true);
    expect((failure as AppError).data).toBeUndefined();
    expect((failure as AppError).dataDropped).toBe(true);
  });

  it('still resolves a value', async () => {
    register('t:ok', () => 7);
    await expect(invokeCoded('t:ok', [])).resolves.toBe(7);
  });
});
