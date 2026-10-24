/* @layer renderer-shell @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createLogBus } from '@drizztdourden08/brock-core';
import { catchGlobalErrors } from '../src/log/catch-global-errors';
import { writeSessionLog } from '../src/log/write-session-log';

const fakeTarget = () => {
  const listeners = new Map<string, Set<(event: never) => void>>();
  return {
    addEventListener: (name: string, fn: (event: never) => void) => { listeners.set(name, new Set([...(listeners.get(name) ?? []), fn])); },
    removeEventListener: (name: string, fn: (event: never) => void) => { listeners.get(name)?.delete(fn); },
    fire: (name: string, event: unknown) => { for (const fn of listeners.get(name) ?? []) fn(event as never); },
    count: (name: string) => listeners.get(name)?.size ?? 0,
  };
};

const quietBus = () => createLogBus<string>({ channels: ['game'], mirrorToConsole: false });

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-14T12:00:00.000Z'));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('the renderer session log', () => {
  it('writes the app log to the session log in batches, a second after the first line', () => {
    const bus = quietBus();
    const written: string[][] = [];
    const target = fakeTarget();
    const stop = writeSessionLog(bus, (lines) => written.push(lines), target as never);
    bus.log('game', 'core started');
    bus.log('app', 'profile loaded', 'warn');
    expect(written).toEqual([]);
    vi.advanceTimersByTime(1000);
    expect(written).toEqual([[
      '[2026-10-14T12:00:00.000Z] [info] [game] core started',
      '[2026-10-14T12:00:00.000Z] [warn] [app] profile loaded',
    ]]);
    bus.error('lost the save');
    target.fire('pagehide', {});
    expect(written.at(-1)).toEqual(['[2026-10-14T12:00:01.000Z] [error] [error] lost the save']);
    stop();
    bus.log('game', 'after the stop');
    vi.advanceTimersByTime(5000);
    expect(written).toHaveLength(2);
    expect(target.count('pagehide')).toBe(0);
  });

  it('writes at once when a batch fills', () => {
    const bus = quietBus();
    const written: string[][] = [];
    writeSessionLog(bus, (lines) => written.push(lines), null);
    for (let i = 0; i < 50; i += 1) bus.log('game', `line ${i}`);
    expect(written).toHaveLength(1);
    expect(written[0]).toHaveLength(50);
  });
});

describe('the global error handlers', () => {
  it('log an uncaught error and an unhandled rejection to the app log, and stop when removed', () => {
    const bus = quietBus();
    const target = fakeTarget();
    const stop = catchGlobalErrors(bus, target as never);
    const boom = new Error('boom');
    boom.stack = 'Error: boom\n    at play (game.ts:3:1)';
    target.fire('error', { error: boom, message: 'boom', filename: 'game.ts', lineno: 3, colno: 1 });
    target.fire('error', { error: null, message: 'Script error.', filename: '' });
    target.fire('unhandledrejection', { reason: { code: 'E_SAVE' } });
    stop();
    target.fire('error', { error: boom, message: 'boom' });
    expect(bus.getEntries().map((entry) => `${entry.level} ${entry.message}`)).toEqual([
      'error Uncaught error (game.ts:3:1): Error: boom\n    at play (game.ts:3:1)',
      'error Uncaught error: Script error.',
      'error Unhandled promise rejection: {"code":"E_SAVE"}',
    ]);
  });

  it('turn the ResizeObserver loop notice into a warning and keep it off the console', () => {
    const bus = quietBus();
    const target = fakeTarget();
    catchGlobalErrors(bus, target as never);
    const preventDefault = vi.fn();
    const message = 'ResizeObserver loop completed with undelivered notifications.';
    target.fire('error', { error: null, message, filename: '', preventDefault });
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(bus.getEntries().map((entry) => `${entry.level} ${entry.message}`)).toEqual([`warn Browser warning: ${message}`]);
  });
});
