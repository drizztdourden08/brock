/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { awaitSignal } from '../src/review/dom/await-signal';
import { currentStep } from '../src/review/dom/current-step';
import { quietLayout } from '../src/review/dom/quiet-layout';
import { until } from '../src/review/dom/until';
import { waitFor } from '../src/review/dom/wait-for';
import { WAIT_CEILING_MS } from '../src/review/review.constants';
import type { WakeSource } from '../src/review/dom/wake.type';

const host = vi.hoisted(() => ({
  alive: vi.fn(),
  check: vi.fn(),
  windows: null as null | (() => void),
}));

vi.mock('../src/host/host-api', () => ({
  hostApi: () => ({
    reviewAlive: host.alive,
    reviewCheck: host.check,
    onReviewWindows: (wake: () => void) => {
      host.windows = wake;
      return () => { host.windows = null; };
    },
  }),
}));

beforeEach(() => {
  host.alive.mockClear();
  host.check.mockClear();
  currentStep.name = 'unit';
});

afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
});

describe('awaitSignal', () => {
  it('resolves on the signal itself, long before any clock window could end', async () => {
    let ready = false;
    let wake: () => void = () => undefined;
    const source: WakeSource = (onWake) => { wake = onWake; return () => undefined; };
    const waiting = awaitSignal(() => ready && 'done', { what: 'a flag', wakeOn: [source] });
    ready = true;
    wake();
    expect(await waiting).toBe('done');
    expect(host.check).not.toHaveBeenCalled();
  });

  it('fails at the ceiling and names what it waited for', async () => {
    vi.useFakeTimers();
    const waiting = awaitSignal(() => false, { what: 'the Logs search sample to appear' });
    await vi.advanceTimersByTimeAsync(WAIT_CEILING_MS);
    expect(await waiting).toBeNull();
    expect(host.check).toHaveBeenCalledWith({
      id: 'wait-ceiling',
      step: 'unit',
      pass: false,
      reason: `gave up after ${WAIT_CEILING_MS / 1000} s waiting for the Logs search sample to appear`,
    });
  });

  it('stays silent when a short, deliberate window runs out', async () => {
    vi.useFakeTimers();
    const waiting = awaitSignal(() => false, { what: 'nothing', ceilingMs: 600 });
    await vi.advanceTimersByTimeAsync(600);
    expect(await waiting).toBeNull();
    expect(host.check).not.toHaveBeenCalled();
  });

  it('tells the watchdog it is alive when it starts and on each wake', async () => {
    vi.useFakeTimers();
    let wake: () => void = () => undefined;
    const source: WakeSource = (onWake) => { wake = onWake; return () => undefined; };
    const waiting = awaitSignal(() => false, { what: 'a flag', wakeOn: [source] });
    expect(host.alive).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1500);
    wake();
    expect(host.alive.mock.calls.length).toBeGreaterThan(1);
    await vi.advanceTimersByTimeAsync(WAIT_CEILING_MS);
    await waiting;
  });

  it('rejects when the probe throws', async () => {
    await expect(awaitSignal(() => { throw new Error('probe broke'); }, { what: 'a probe' })).rejects.toThrow('probe broke');
  });
});

describe('waitFor', () => {
  it('resolves when the page changes, without a clock', async () => {
    const waiting = waitFor(() => document.querySelector('.late'), undefined, 'the late element');
    const late = document.createElement('div');
    late.className = 'late';
    document.body.append(late);
    expect(await waiting).toBe(late);
  });

  it('gives up after a short window and returns null', async () => {
    vi.useFakeTimers();
    const waiting = waitFor(() => document.querySelector('.never'), 600);
    await vi.advanceTimersByTimeAsync(600);
    expect(await waiting).toBeNull();
  });
});

describe('until', () => {
  it('resolves on a window event from main', async () => {
    let open = false;
    const waiting = until(() => Promise.resolve(open), 'the popped window to open');
    await Promise.resolve();
    open = true;
    host.windows?.();
    expect(await waiting).toBe(true);
  });

  it('is false and names the window at the ceiling', async () => {
    vi.useFakeTimers();
    const waiting = until(() => Promise.resolve(false), 'the popped window to open');
    await vi.advanceTimersByTimeAsync(WAIT_CEILING_MS);
    expect(await waiting).toBe(false);
    expect(host.check.mock.calls[0]?.[0]).toMatchObject({ reason: expect.stringContaining('the popped window to open') as unknown });
  });
});

describe('quietLayout', () => {
  it('resolves once the layout stops changing', async () => {
    await expect(quietLayout()).resolves.toBeUndefined();
  });

  it('resolves at the ceiling for a layout that never stops changing', async () => {
    vi.useFakeTimers();
    const churn = setInterval(() => document.body.append(document.createElement('i')), 5);
    const quiet = quietLayout(2000);
    await vi.advanceTimersByTimeAsync(2000);
    clearInterval(churn);
    await expect(quiet).resolves.toBeUndefined();
  });
});
