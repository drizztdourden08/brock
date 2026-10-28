/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createReviewWatchdog } from '../src/main/review/create-review-watchdog';
import type { ReviewWatchdogTrip } from '../src/main/review/review-watchdog.type';

const START = 60_000;
const IDLE = 45_000;
const CAP = 300_000;
const STEP_MAX = 1_800_000;

const trips: ReviewWatchdogTrip[] = [];
const make = () => createReviewWatchdog({ startMs: START, idleMs: IDLE, bootCapMs: CAP, stepMaxMs: STEP_MAX, onTrip: (trip) => trips.push(trip) });

beforeEach(() => {
  vi.useFakeTimers();
  trips.length = 0;
});

afterEach(() => {
  vi.useRealTimers();
});

describe('the review watchdog before the tour starts', () => {
  it('trips when the boot is silent for the whole start limit', async () => {
    make();
    await vi.advanceTimersByTimeAsync(START);
    expect(trips).toEqual([{ kind: 'silent-boot', ms: START }]);
  });

  it('keeps going while boot tasks report progress, past the plain start limit', async () => {
    const dog = make();
    for (let tick = 0; tick < 4; tick += 1) {
      await vi.advanceTimersByTimeAsync(START - 1000);
      dog.bootActivity();
    }
    expect(trips).toEqual([]);
    await vi.advanceTimersByTimeAsync(START);
    expect(trips).toEqual([{ kind: 'silent-boot', ms: START }]);
  });

  it('keeps a hard ceiling on a boot that reports progress forever', async () => {
    const dog = make();
    for (let elapsed = 0; elapsed < CAP; elapsed += 10_000) {
      await vi.advanceTimersByTimeAsync(10_000);
      dog.bootActivity();
    }
    expect(trips).toEqual([{ kind: 'boot-cap', ms: CAP }]);
  });
});

describe('the review watchdog once the tour runs', () => {
  it('trips only after the idle limit of silence', async () => {
    const dog = make();
    dog.working();
    await vi.advanceTimersByTimeAsync(IDLE - 1);
    expect(trips).toEqual([]);
    await vi.advanceTimersByTimeAsync(1);
    expect(trips).toEqual([{ kind: 'idle', ms: IDLE }]);
  });

  it('stays alive while waits and steps keep reporting activity', async () => {
    const dog = make();
    dog.working();
    for (let tick = 0; tick < 10; tick += 1) {
      await vi.advanceTimersByTimeAsync(IDLE - 5000);
      dog.working();
    }
    expect(trips).toEqual([]);
  });

  it('no longer counts boot activity or the boot limits once the tour began', async () => {
    const dog = make();
    dog.working();
    dog.bootActivity();
    await vi.advanceTimersByTimeAsync(CAP);
    expect(trips).toEqual([{ kind: 'idle', ms: IDLE }]);
  });

  it('trips once, and not at all after stop', async () => {
    const dog = make();
    dog.working();
    dog.stop();
    await vi.advanceTimersByTimeAsync(CAP);
    expect(trips).toEqual([]);
  });
});

describe('a step that declares a long operation', () => {
  const TWO_MINUTES = 120_000;

  it('is not stopped at the default idle limit, and is stopped after its own limit', async () => {
    const dog = make();
    dog.working(TWO_MINUTES);
    await vi.advanceTimersByTimeAsync(IDLE + 1000);
    expect(trips).toEqual([]);
    await vi.advanceTimersByTimeAsync(TWO_MINUTES - IDLE - 1000);
    expect(trips).toEqual([{ kind: 'idle', ms: TWO_MINUTES }]);
  });

  it('keeps its limit through plain pings and drops it when the next step starts', async () => {
    const dog = make();
    dog.working(TWO_MINUTES);
    await vi.advanceTimersByTimeAsync(60_000);
    dog.working();
    await vi.advanceTimersByTimeAsync(TWO_MINUTES - 1);
    expect(trips).toEqual([]);
    dog.working(null);
    await vi.advanceTimersByTimeAsync(IDLE);
    expect(trips).toEqual([{ kind: 'idle', ms: IDLE }]);
  });

  it('caps the declared limit at the step maximum', async () => {
    const dog = make();
    dog.working(STEP_MAX * 10);
    await vi.advanceTimersByTimeAsync(STEP_MAX);
    expect(trips).toEqual([{ kind: 'idle', ms: STEP_MAX }]);
  });

  it('ignores a limit that is not a positive number', async () => {
    const dog = make();
    dog.working(-5);
    await vi.advanceTimersByTimeAsync(IDLE);
    expect(trips).toEqual([{ kind: 'idle', ms: IDLE }]);
  });
});
