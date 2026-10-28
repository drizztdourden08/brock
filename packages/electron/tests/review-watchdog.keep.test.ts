/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createReviewWatchdog } from '../src/main/review/create-review-watchdog';
import type { ReviewWatchdogTrip } from '../src/main/review/review-watchdog.type';

const START = 60_000;
const IDLE = 45_000;
const CAP = 300_000;

const trips: ReviewWatchdogTrip[] = [];
const make = () => createReviewWatchdog({ startMs: START, idleMs: IDLE, bootCapMs: CAP, onTrip: (trip) => trips.push(trip) });

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
