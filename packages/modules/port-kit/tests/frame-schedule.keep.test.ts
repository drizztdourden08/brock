/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { nextTimerDue } from '../src/renderer/frame/next-timer-due';
import { TIMER_PERIOD_MS } from '../src/renderer/frame/frame.constants';

describe('I-191 nextTimerDue', { tags: ['critical'] }, () => {
  it('keeps the grid when a tick fires a little late', () => {
    expect(nextTimerDue(100, 103)).toBeCloseTo(100 + TIMER_PERIOD_MS);
  });

  it('resyncs to now when far behind', () => {
    expect(nextTimerDue(0, 1000)).toBeCloseTo(1000 + TIMER_PERIOD_MS);
  });
});
