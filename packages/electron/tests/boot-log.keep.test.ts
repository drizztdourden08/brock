/* @layer electron-main @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { logBootTask } from '../src/main/bootstrap/log-boot-task';

describe('K1 the always-on boot log', { tags: ['critical'] }, () => {
  afterEach(() => vi.restoreAllMocks());

  it('prints a tagged line with the task duration, with no flag', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    logBootTask('main', { id: 'window-state', label: 'Window', state: 'done', ms: 12 });
    expect(log.mock.calls[0]?.[0]).toMatch(/^\[boot\] \+\d+ms main task window-state done \(12ms\)$/);
  });

  it('prints the error message of a failed renderer task', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    logBootTask('renderer', { id: 'fonts', label: 'Fonts', state: 'fail', ms: 7, message: 'boom' });
    expect(log.mock.calls[0]?.[0]).toMatch(/renderer task fonts fail \(7ms\): boom$/);
  });
});
