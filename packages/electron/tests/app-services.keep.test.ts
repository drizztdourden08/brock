/* @layer electron-main @kind test */
import { describe, expect, it, vi } from 'vitest';
import { buildServices } from '../src/main/services/build-services';
import { disposeServices } from '../src/main/services/dispose-services';
import { servicesProxy } from '../src/main/services/services-proxy';
import { servicesState } from '../src/main/services/services-state';

const contextWith = (log = vi.fn()) => ({ log, services: servicesProxy });

describe('app services', () => {
  it('says why ctx.services is empty before the build, builds once and forwards through copies of the context', async () => {
    const ctx = contextWith();
    expect(() => { Reflect.get(ctx.services, 'sessions'); }).toThrow(/pass services/);
    await buildServices(ctx, undefined);
    expect(servicesState.value).toBeNull();

    const copy = { ...ctx };
    const stopLocal = vi.fn();
    const factory = vi.fn(() => ({ sessions: { stopLocal }, dispose: vi.fn() }));
    await buildServices(ctx, factory);
    await buildServices(ctx, factory);
    expect(factory).toHaveBeenCalledTimes(1);
    expect(factory).toHaveBeenCalledWith(ctx);
    expect(Reflect.get(copy.services, 'sessions')).toEqual({ stopLocal });
    expect('sessions' in copy.services).toBe(true);
    expect(Object.keys(copy.services)).toEqual(['sessions', 'dispose']);
  });

  it('disposes on will-quit, once, and logs a failing dispose', async () => {
    const dispose = Reflect.get(servicesState.value ?? {}, 'dispose') as ReturnType<typeof vi.fn>;
    const ctx = contextWith();
    disposeServices(ctx);
    disposeServices(ctx);
    await Promise.resolve();
    expect(dispose).toHaveBeenCalledTimes(1);
    expect(() => { Reflect.get(ctx.services, 'sessions'); }).toThrow(/before the services were built/);

    const log = vi.fn();
    servicesState.value = { dispose: () => Promise.reject(new Error('busy')) };
    disposeServices(contextWith(log));
    await new Promise((resolve) => { setTimeout(resolve, 0); });
    expect(log).toHaveBeenCalledWith(expect.stringContaining('busy'), 'error');
  });
});
