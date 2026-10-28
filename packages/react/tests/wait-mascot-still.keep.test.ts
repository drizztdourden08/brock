/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WAIT_CEILING_MS } from '../src/review/review.constants';
import { waitMascotStill } from '../src/review/steps/wait-mascot-still';

const stage = (place: () => number): void => {
  document.body.innerHTML = '<div class="guided-tour__mascot--shown"><div class="mascot-stage__actor"></div></div>';
  const actor = document.querySelector('.mascot-stage__actor');
  if (!actor) throw new Error('no actor');
  actor.getBoundingClientRect = () => new DOMRect(place(), 10, 20, 20);
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
});

describe('waitMascotStill', () => {
  it('passes once a mascot that walks for a second has stopped', async () => {
    const start = performance.now();
    stage(() => Math.min(300, (performance.now() - start) * 0.3));
    const done = waitMascotStill();
    await vi.advanceTimersByTimeAsync(2000);
    expect(await done).toBe(true);
  });

  it('fails at the bound for a mascot that never stops', async () => {
    stage(() => performance.now());
    const done = waitMascotStill();
    await vi.advanceTimersByTimeAsync(WAIT_CEILING_MS);
    expect(await done).toBe(false);
  });

  it('passes at once when no mascot is drawn', async () => {
    const done = waitMascotStill();
    await vi.advanceTimersByTimeAsync(0);
    expect(await done).toBe(true);
  });
});
