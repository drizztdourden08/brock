/* @layer renderer-shell @kind test */
import { describe, expect, it, vi } from 'vitest';
import { appTitleBarSources } from '../src/title-bar/app-title-bar-sources';
import { titleBarFromFiles } from '../src/title-bar/title-bar-from-files';
import { toBarAction } from '../src/title-bar/to-bar-action';
import type { TitleBarItemEntry } from '../src/title-bar/title-bar-item.type';
import { jobStepper } from '../src/jobs/JobDialog/behavior/job-stepper';
import type { JobSnapshot } from '@drizztdourden08/brock-core/types';

describe('toBarAction', () => {
  it('turns a button into a bar button', () => {
    const onSelect = vi.fn();
    expect(toBarAction('hosting', { kind: 'button', label: 'Host', icon: 'server', onSelect, shortcut: 'Mod+H' }))
      .toEqual({ id: 'hosting', label: 'Host', icon: 'server', bar: 'button', tone: undefined, shortcut: 'Mod+H', onSelect });
  });

  it('turns a status into a status pill that shows only while the status is set', () => {
    expect(toBarAction('room', { kind: 'status', label: 'Room', icon: 'radio', status: 'Hosting: Seed 42', tone: 'success' }))
      .toMatchObject({ id: 'room', bar: 'status', status: 'Hosting: Seed 42', tone: 'success' });
    expect(toBarAction('room', { kind: 'status', label: 'Room', icon: 'radio', status: null }).status).toBeUndefined();
  });

  it('turns a menu into a bar button that opens its own dropdown', () => {
    const action = toBarAction('rooms', { kind: 'menu', label: 'Rooms', icon: 'server', items: [{ key: 'open', label: 'Open room' }] });
    expect(action).toMatchObject({ id: 'rooms', bar: 'button', label: 'Rooms' });
    expect(typeof action.onSelect).toBe('function');
  });
});

describe('appTitleBarSources', () => {
  const button: TitleBarItemEntry = { id: 'hosting', source: { kind: 'button', label: 'Host', icon: 'server', onSelect: () => undefined } };

  it('keeps the files in id order and drops an item whose id a standard or module item holds', () => {
    const entries = titleBarFromFiles([{ id: 'search', source: button.source }, button]);
    expect(entries.map((entry) => entry.id)).toEqual(['hosting', 'search']);
    const sources = appTitleBarSources(entries, ['search', 'report-bug']);
    expect(sources).toHaveLength(1);
    expect(sources[0]).toMatchObject({ id: 'hosting', bar: 'button' });
  });

  it('wraps a hook so it resolves to a bar action, or to nothing while it returns null', () => {
    let status: string | null = null;
    const [source] = appTitleBarSources([{ id: 'room', source: () => (status ? { kind: 'status', label: 'Room', icon: 'radio', status } : null) }], []);
    if (typeof source !== 'function') throw new Error('a hook source stays a hook');
    expect(source()).toBeNull();
    status = 'Hosting';
    expect(source()).toMatchObject({ id: 'room', bar: 'status', status: 'Hosting' });
  });
});

describe('jobStepper', () => {
  const job = (patch: Partial<JobSnapshot>): JobSnapshot => ({
    id: 'setup', title: 'Setup', state: 'running', currentStep: 'b', progress: 0.5, stepProgress: 0, line: null, error: null, log: [], startedAt: 0, endedAt: null, cancellable: true,
    steps: [{ id: 'a', label: 'A', weight: 1, state: 'done' }, { id: 'b', label: 'B', weight: 1, state: 'current' }],
    ...patch,
  });

  it('points at the current step while running, the failed step on failure and a finished step when done', () => {
    expect(jobStepper(job({})).currentId).toBe('b');
    const failed = jobStepper(job({ state: 'failed', steps: [{ id: 'a', label: 'A', weight: 1, state: 'failed' }, { id: 'b', label: 'B', weight: 1, state: 'upcoming' }] }));
    expect(failed.currentId).toBe('a');
    expect(failed.steps[0]?.error).toBe(true);
    const done = jobStepper(job({ state: 'done' }));
    expect(done.steps.map((step) => step.id)).toEqual(['a', 'b', 'job-finished']);
    expect(done.currentId).toBe('job-finished');
  });
});
