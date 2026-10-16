/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { formatDate } from '@drizztdourden08/tessera/primitives';
import { LOG_TIME_FORMAT } from '../src/diagnostics/diagnostics.constants';
import { formatLogTime } from '../src/diagnostics/format-log-time';
import { jobLogRows } from '../src/jobs/JobDialog/behavior/job-log-rows';
import { ProfileLastUsed } from '../src/shell/ProfilesScreen/sub-components/ProfileLastUsed';
import { toLogRows } from '../src/widgets/built-in/LogsWidget/behavior/to-log-rows';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const AT = new Date(2026, 9, 16, 9, 5, 7).getTime();
const FIVE_MINUTES_MS = 5 * 60_000;

let root: Root | null = null;
let host: HTMLElement | null = null;

const mount = (at: number): HTMLElement => {
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  act(() => { root?.render(createElement(ProfileLastUsed, { at })); });
  return host;
};

afterEach(() => {
  act(() => { root?.unmount(); });
  host?.remove();
  root = null;
  host = null;
});

describe('log times', () => {
  it('reads a log time as an absolute 24 hour clock with seconds', () => {
    expect(formatLogTime(AT)).toBe(formatDate(AT, LOG_TIME_FORMAT));
    expect(formatLogTime(AT)).toMatch(/09\D+05\D+07/);
    expect(formatLogTime(new Date(2026, 9, 16, 21, 40, 12).getTime())).toMatch(/21\D+40\D+12/);
  });

  it('draws the Logs widget and job log gutters with it', () => {
    const [entry] = toLogRows([{ id: 1, timestamp: AT, level: 'info', channel: 'app', message: 'started' }]);
    const [line] = jobLogRows([{ at: AT, level: 'info', message: 'step' }]);
    expect(entry?.gutter).toBe(formatLogTime(AT));
    expect(line?.gutter).toBe(formatLogTime(AT));
  });
});

describe('ProfileLastUsed', () => {
  it('shows when a profile was last used as a relative time element', () => {
    const at = Date.now() - FIVE_MINUTES_MS;
    const time = mount(at).querySelector('time');
    expect(time?.getAttribute('datetime')).toBe(new Date(at).toISOString());
    expect(time?.textContent).toBe(formatDate(at, 'relative'));
  });

  it('reads Never for a profile not used yet, and keeps the review mask', () => {
    const shown = mount(0);
    expect(shown.querySelector('time')).toBeNull();
    expect(shown.textContent).toBe('Never');
    expect(shown.firstElementChild?.hasAttribute('data-review-mask')).toBe(true);
  });
});
