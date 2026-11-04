/* @layer core @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createLocationPoller, POLL_INTERVAL_MS } from '../src/session';
import type { LocationPoller, PollEntry } from '../src/session';
import { toyMemory } from './toy-memory.fixture';
import type { ToyMemory } from './toy-memory.fixture';

const ENTRIES: PollEntry[] = [
  { key: 'a', probe: { region: 'ram', offset: 0, mask: 0x10 } },
  { key: 'b', probe: { region: 'ram', offset: 1, compare: 'gte', value: 3 } },
  { key: 'c', probe: { custom: (view) => view.byte('ram', 2) === 7 } },
];

type Rig = { memory: ToyMemory; poller: LocationPoller; reports: string[]; logs: string[] };

const rig = (known: ReadonlySet<string> = new Set()): Rig => {
  const memory = toyMemory();
  const logs: string[] = [];
  const reports: string[] = [];
  const poller = createLocationPoller({ memory: memory.bridge, log: (msg) => logs.push(msg) });
  poller.start(ENTRIES, { report: (key) => reports.push(key), isKnownReported: (key) => known.has(key) });
  return { memory, poller, reports, logs };
};

describe('location poller', { tags: ['critical'] }, () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('reports a check once, on the interval', () => {
    const { memory, poller, reports, logs } = rig();
    vi.advanceTimersByTime(POLL_INTERVAL_MS);
    memory.poke('ram', 0, 0x10);
    vi.advanceTimersByTime(POLL_INTERVAL_MS * 3);
    expect(reports).toEqual(['a']);
    expect(logs[0]).toBe('[Poller] Location polling started: 3 checks (every 1000ms)');
    expect(logs).toContain('[Poller] Check completed: a');
    expect([...poller.reported()]).toEqual(['a']);
  });

  it('rebaselines after a state load and reports only unknown checks', () => {
    const { memory, poller, reports, logs } = rig(new Set(['a']));
    poller.pollOnce();
    memory.poke('ram', 0, 0x10);
    memory.poke('ram', 1, 3);
    memory.loadState();
    poller.pollOnce();
    expect(logs).toContain('[Poller] Re-baselined: 2/3 already complete, 1 unreported');
    expect(reports).toEqual(['b']);
    memory.clear();
    memory.loadState();
    poller.pollOnce();
    expect(poller.reported().size).toBe(0);
  });

  it('keeps a suppressed check out of the reports and the rebaseline', () => {
    const { memory, poller, reports } = rig();
    poller.pollOnce();
    poller.suppress('c');
    memory.poke('ram', 2, 7);
    poller.pollOnce();
    memory.loadState();
    poller.pollOnce();
    expect(reports).toEqual([]);
    expect(poller.reported().has('c')).toBe(true);
  });

  it('gives a mask precedence over a compare and reads a word little endian', () => {
    const memory = toyMemory();
    const reports: string[] = [];
    const poller = createLocationPoller({ memory: memory.bridge, log: () => undefined });
    poller.start([
      { key: 'both', probe: { region: 'ram', offset: 4, mask: 0x01, compare: 'eq', value: 9 } },
      { key: 'word', probe: { region: 'ram', offset: 8, width: 2, mask: 0x0100 } },
    ], { report: (key) => reports.push(key) });
    poller.pollOnce();
    memory.poke('ram', 4, 8);
    memory.poke('ram', 9, 1);
    poller.pollOnce();
    expect(reports).toEqual(['word']);
  });

  it('stops polling and drops the state load listener on stop', () => {
    const { memory, poller, reports, logs } = rig();
    expect(memory.stateLoadListeners()).toBe(1);
    poller.stop();
    memory.poke('ram', 0, 0x10);
    vi.advanceTimersByTime(POLL_INTERVAL_MS * 2);
    expect(reports).toEqual([]);
    expect(memory.stateLoadListeners()).toBe(0);
    expect(logs).toContain('[Poller] Location polling stopped');
  });
});
