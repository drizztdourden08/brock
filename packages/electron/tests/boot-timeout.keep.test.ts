/* @layer electron-main @kind test */
import { describe, expect, it } from 'vitest';
import { createAutomationFlags } from '@drizztdourden08/brock-core/automation';
import { bootTimeout } from '../src/main/boot/boot-timeout';
import { secondsFlagMs } from '../src/main/bootstrap/seconds-flag-ms';

const flags = createAutomationFlags();
const timeoutOf = (...argv: string[]) => bootTimeout(flags, ['electron', '.', ...argv]);

describe('K1 the --boot-timeout cap', { tags: ['critical'] }, () => {
  it('is 20 s for a normal launch', () => {
    expect(timeoutOf()).toEqual({ ms: 20_000, problem: null });
  });

  it('is 60 s for an automated launch', () => {
    expect(timeoutOf('--screenshot=boot').ms).toBe(60_000);
    expect(timeoutOf('--no-focus').ms).toBe(60_000);
  });

  it('lets the flag win over both defaults', () => {
    expect(timeoutOf('--boot-timeout=90').ms).toBe(90_000);
    expect(timeoutOf('--screenshot=boot', '--boot-timeout=5').ms).toBe(5_000);
  });

  it('keeps the default and reports a value that is not seconds', () => {
    const bad = timeoutOf('--boot-timeout=soon');
    expect(bad.ms).toBe(20_000);
    expect(bad.problem).toContain('--boot-timeout=soon is not a count of seconds above 0');
    expect(timeoutOf('--screenshot=boot', '--boot-timeout=0').ms).toBe(60_000);
    expect(timeoutOf('--boot-timeout=-3').problem).not.toBeNull();
  });
});

describe('K1 secondsFlagMs', { tags: ['critical'] }, () => {
  it('turns seconds into milliseconds and falls back on a bad value', () => {
    expect(secondsFlagMs('--x', '1.5', 9_000)).toEqual({ ms: 1_500, problem: null });
    expect(secondsFlagMs('--x', null, 9_000)).toEqual({ ms: 9_000, problem: null });
    expect(secondsFlagMs('--x', 'no', 9_000).problem).toBe('--x=no is not a count of seconds above 0; waiting 9 s');
  });
});
