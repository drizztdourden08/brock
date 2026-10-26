/* @layer core @kind test */
import { describe, expect, it, vi } from 'vitest';
import type { JobSnapshot } from '@drizztdourden08/brock-core/types';
import { createJobRegistry } from '../src/jobs/create-job-registry';
import { tailLog } from '../src/jobs/tail-log';

describe('tailLog', () => {
  it('keeps the newest lines that fit the byte cap and always at least one', () => {
    const log = ['a', 'b', 'c', 'd'].map((message, at) => ({ at, level: 'info' as const, message: message.repeat(100) }));
    expect(tailLog(log, 300).map((line) => line.message[0])).toEqual(['c', 'd']);
    expect(tailLog(log, 10).map((line) => line.message[0])).toEqual(['d']);
    expect(tailLog(log, 100_000)).toHaveLength(4);
    expect(tailLog([], 100)).toEqual([]);
  });
});

describe('job emits', () => {
  it('cap the log in each emitted snapshot while the registry keeps every line', () => {
    const emitted: JobSnapshot[] = [];
    const registry = createJobRegistry((snapshot) => emitted.push(snapshot));
    const job = registry.start('chatty', []);
    vi.useFakeTimers();
    for (let n = 0; n < 500; n += 1) job.log(`line ${n} ${'x'.repeat(1000)}`);
    job.done();
    vi.useRealTimers();
    const last = emitted.at(-1);
    expect(last?.log.length).toBeLessThan(100);
    expect(last?.log.at(-1)?.message.startsWith('line 499')).toBe(true);
    expect(registry.list()[0]?.log).toHaveLength(500);
  });
});
