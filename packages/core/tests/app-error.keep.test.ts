/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { AppError, decodeAppError, encodeAppError, isAppError, toAppError } from '../src/ipc';

describe('AppError over the wire', () => {
  it('round-trips the message, code and data', () => {
    const sent = new AppError('Install failed', { code: 'install-failed', data: { step: 'unpack', files: [1, 2], retry: false, note: null } });
    const received = decodeAppError(encodeAppError(sent));
    expect(received).toBeInstanceOf(AppError);
    expect(received?.message).toBe('Install failed');
    expect(received?.code).toBe('install-failed');
    expect(received?.data).toEqual({ step: 'unpack', files: [1, 2], retry: false, note: null });
    expect(received?.dataDropped).toBe(false);
  });

  it('strips the Electron invoke prefix', () => {
    const encoded = encodeAppError(new AppError('Nope', { code: 'denied' }));
    const received = decodeAppError(`Error invoking remote method 'a:b': Error: ${encoded}`);
    expect(received?.message).toBe('Nope');
    expect(received?.code).toBe('denied');
  });

  it('drops data over the cap and marks it', () => {
    const big = new AppError('Too much', { code: 'big', data: { blob: 'x'.repeat(9000) } });
    const received = decodeAppError(encodeAppError(big));
    expect(received?.code).toBe('big');
    expect(received?.data).toBeUndefined();
    expect(received?.dataDropped).toBe(true);
  });

  it('keeps data exactly at the cap', () => {
    const data = 'x'.repeat(8190);
    expect(decodeAppError(encodeAppError(new AppError('m', { code: 'edge', data })))?.data).toBe(data);
  });

  it('never carries a stack', () => {
    const error = new AppError('Boom', { code: 'boom' });
    expect(encodeAppError(error)).not.toContain('at ');
  });

  it('returns undefined for a plain message or a damaged payload', () => {
    expect(decodeAppError('just a message')).toBeUndefined();
    const encoded = encodeAppError(new AppError('m', { code: 'ok' }));
    expect(decodeAppError(`${encoded.slice(0, -2)}`)).toBeUndefined();
    expect(decodeAppError(encoded.replace('"ok"', '"bad code"'))).toBeUndefined();
  });

  it('keeps a marker inside the message from forging a payload', () => {
    const forged = new AppError(`x${encodeAppError(new AppError('y', { code: 'forged' }))}`, { code: 'real' });
    expect(decodeAppError(encodeAppError(forged))?.code).toBe('real');
  });
});

describe('AppError construction', () => {
  it('rejects data that is not JSON-safe', () => {
    const data = { fn: () => 1 } as never;
    expect(() => new AppError('m', { code: 'bad', data })).toThrow(TypeError);
    expect(() => new AppError('m', { code: 'bad', data: { error: new Error('x') } as never })).toThrow(TypeError);
    expect(() => new AppError('m', { code: 'bad', data: Number.NaN })).toThrow(TypeError);
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    expect(() => new AppError('m', { code: 'bad', data: cyclic as never })).toThrow(TypeError);
  });

  it('rejects a code that is not a short token', () => {
    expect(() => new AppError('m', { code: '' })).toThrow(TypeError);
    expect(() => new AppError('m', { code: 'has space' })).toThrow(TypeError);
  });
});

describe('isAppError', () => {
  it('matches an instance and narrows by code', () => {
    const error: unknown = new AppError('m', { code: 'install-failed', data: { step: 'x' } });
    expect(isAppError(error)).toBe(true);
    expect(isAppError(error, 'install-failed')).toBe(true);
    expect(isAppError(error, 'other')).toBe(false);
    if (isAppError(error, 'install-failed')) expect(error.data).toEqual({ step: 'x' });
  });

  it('adopts an encoded plain Error from across the bridge', () => {
    const crossed = new Error(encodeAppError(new AppError('Install failed', { code: 'install-failed', data: { step: 'unpack' } })));
    expect(isAppError(crossed, 'install-failed')).toBe(true);
    expect(crossed.message).toBe('Install failed');
    expect(toAppError(crossed)?.data).toEqual({ step: 'unpack' });
    expect(isAppError(crossed, 'other')).toBe(false);
    expect(isAppError(crossed, 'install-failed')).toBe(true);
  });

  it('is false for plain errors and non-errors', () => {
    expect(isAppError(new Error('plain'))).toBe(false);
    expect(isAppError('text')).toBe(false);
    expect(isAppError(undefined)).toBe(false);
  });
});
