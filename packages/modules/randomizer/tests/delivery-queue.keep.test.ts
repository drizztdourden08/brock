/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { createDeliveryQueue } from '../src/session';
import type { DeliveryOutcome, DeliveryQueue, FrameClock, ItemDeliverer } from '../src/session';

type Rig = {
  events: string[];
  logs: string[];
  safe: { value: boolean };
  holds: { value: boolean };
  outcomes: DeliveryOutcome[];
  subscribers: Set<() => void>;
  queue: DeliveryQueue<string>;
  frames: (count: number) => void;
};

const makeRig = (): Rig => {
  const events: string[] = [];
  const logs: string[] = [];
  const safe = { value: true };
  const holds = { value: false };
  const outcomes: DeliveryOutcome[] = [];
  const subscribers = new Set<() => void>();
  const clock: FrameClock = {
    onFrame: (cb) => {
      subscribers.add(cb);
      return () => subscribers.delete(cb);
    },
  };
  const deliverer: ItemDeliverer<string> = {
    isSafeFrame: () => safe.value,
    execute: (action) => {
      events.push(`execute:${action}`);
      return outcomes.shift() ?? 'done';
    },
    holdsInFlight: () => holds.value,
  };
  const queue = createDeliveryQueue<string>({ deliverer, clock, log: (msg, level) => logs.push(`${level}:${msg}`) });
  const frames = (count: number): void => {
    for (let i = 0; i < count; i++) for (const cb of [...subscribers]) cb();
  };
  return { events, logs, safe, holds, outcomes, subscribers, queue, frames };
};

const enqueueNamed = (rig: Rig, name: string): void => {
  rig.queue.enqueue({
    message: name,
    source: 'test',
    action: name,
    onGranted: () => rig.events.push(`granted:${name}`),
    onComplete: () => rig.events.push(`complete:${name}`),
  });
};

describe('delivery queue', { tags: ['critical'] }, () => {
  it('delivers a plain item and completes once the player is safe again', () => {
    const rig = makeRig();
    rig.queue.start();
    enqueueNamed(rig, 'a');
    rig.frames(1);
    expect(rig.events).toEqual(['execute:a', 'granted:a']);
    rig.safe.value = false;
    rig.frames(1);
    rig.safe.value = true;
    rig.frames(1);
    expect(rig.events).toEqual(['execute:a', 'granted:a', 'complete:a']);
    expect(rig.queue.size()).toBe(0);
  });

  it('waits the cooldown between two deliveries', () => {
    const rig = makeRig();
    rig.outcomes.push('settled', 'settled');
    rig.queue.start();
    enqueueNamed(rig, 'a');
    enqueueNamed(rig, 'b');
    rig.frames(1);
    expect(rig.events).toEqual(['execute:a', 'granted:a', 'complete:a']);
    rig.frames(30);
    expect(rig.events).toHaveLength(3);
    rig.frames(1);
    expect(rig.events.slice(3)).toEqual(['execute:b', 'granted:b', 'complete:b']);
  });

  it('retries a refusal every 30 frames and warns every 10th', () => {
    const rig = makeRig();
    rig.outcomes.push(...Array<DeliveryOutcome>(10).fill('refused'), 'settled');
    rig.queue.start();
    enqueueNamed(rig, 'a');
    rig.frames(1);
    rig.frames(30);
    expect(rig.events).toEqual(['execute:a']);
    rig.frames(1);
    expect(rig.events).toEqual(['execute:a', 'execute:a']);
    for (let i = 0; i < 7; i++) rig.frames(31);
    expect(rig.logs).toEqual([]);
    rig.frames(31);
    expect(rig.logs).toEqual(['warn:Delivery "a" refused 10 times, retrying until the player can receive']);
    expect(rig.events.filter((e) => e === 'execute:a')).toHaveLength(10);
    expect(rig.events).not.toContain('granted:a');
    rig.frames(31);
    expect(rig.events.slice(-2)).toEqual(['granted:a', 'complete:a']);
  });

  it('times out an in-flight item after 600 frames', () => {
    const rig = makeRig();
    rig.queue.start();
    enqueueNamed(rig, 'a');
    rig.frames(600);
    expect(rig.events).not.toContain('complete:a');
    rig.frames(1);
    expect(rig.events).toEqual(['execute:a', 'granted:a', 'complete:a']);
    expect(rig.logs).toEqual(['warn:Delivery "a" timed out waiting for pickup to finish']);
  });

  it('keeps an in-flight item the deliverer still holds', () => {
    const rig = makeRig();
    rig.holds.value = true;
    rig.queue.start();
    enqueueNamed(rig, 'a');
    rig.frames(601);
    expect(rig.logs).toEqual(['warn:Delivery "a" still waiting for its pickup to finish, keeping it in flight']);
    expect(rig.events).not.toContain('complete:a');
    rig.holds.value = false;
    rig.frames(600);
    expect(rig.events).toContain('complete:a');
    expect(rig.logs[1]).toBe('warn:Delivery "a" timed out waiting for pickup to finish');
  });

  it('executes only on a safe frame', () => {
    const rig = makeRig();
    rig.safe.value = false;
    rig.queue.start();
    enqueueNamed(rig, 'a');
    rig.frames(5);
    expect(rig.events).toEqual([]);
    rig.safe.value = true;
    rig.frames(1);
    expect(rig.events).toEqual(['execute:a', 'granted:a']);
  });

  it('clear drops every entry and completes each one', () => {
    const rig = makeRig();
    rig.queue.start();
    enqueueNamed(rig, 'a');
    enqueueNamed(rig, 'b');
    rig.frames(1);
    rig.queue.clear();
    expect(rig.events.slice(-2)).toEqual(['complete:a', 'complete:b']);
    expect(rig.queue.size()).toBe(0);
    rig.frames(5);
    expect(rig.events).toHaveLength(4);
  });

  it('subscribes once on start and unsubscribes on stop', () => {
    const rig = makeRig();
    rig.queue.start();
    rig.queue.start();
    expect(rig.subscribers.size).toBe(1);
    rig.queue.stop();
    expect(rig.subscribers.size).toBe(0);
  });
});
