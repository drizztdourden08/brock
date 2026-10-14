/* @layer renderer-shell @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BugReportPayload, LogEntry } from '@drizztdourden08/brock-core';
import { buildBugReportPayload } from '../src/bug-report/build-bug-report-payload';
import { resolveBugReportTarget } from '../src/bug-report/resolve-bug-report-target';
import { deliverReport } from '../src/bug-report/BugReportDialog/behavior/deliver-report';
import { announceReceipt } from '../src/bug-report/BugReportDialog/behavior/announce-receipt';

const toasts = vi.hoisted(() => [] as { message: string; options: { variant?: string; action?: { label: string; onSelect: () => void } } }[]);
const opened = vi.hoisted(() => [] as string[]);

vi.mock('../src/toast/toast', () => ({ toast: (message: string, options = {}) => { toasts.push({ message, options }); return 'id'; } }));
vi.mock('../src/host/open-external', () => ({ openExternal: (url: string) => { opened.push(url); } }));

const PRODUCT = { id: 'my-app', name: 'My App' };
const REPO = { owner: 'someone', name: 'my-app' };

const entry = (id: number, message: string): LogEntry => ({ id, timestamp: 1000 + id, channel: 'app', level: 'info', message });

const payload = (extra: Partial<BugReportPayload> = {}): BugReportPayload => ({
  title: 'Crash', description: 'It closed.', app: { id: 'my-app', name: 'My App', version: '1.0.0' }, diagnostics: null, createdAt: '2026-10-07T00:00:00.000Z', ...extra,
});

beforeEach(() => {
  toasts.length = 0;
  opened.length = 0;
});

describe('buildBugReportPayload', () => {
  it('carries the trimmed text, the app, the debug text, the system facts and the recent log, redacted', () => {
    const logs = Array.from({ length: 250 }, (_, i) => entry(i, i === 249 ? 'token=abc123secret' : `line ${i}`));
    const built = buildBugReportPayload({
      title: '  Crash  ', description: ' It closed. ', product: PRODUCT, version: '1.2.3', diagnostics: 'Version: 1.2.3', system: null, logs, now: new Date(0),
    });
    expect(built).toMatchObject({ title: 'Crash', description: 'It closed.', app: { id: 'my-app', name: 'My App', version: '1.2.3' }, createdAt: '1970-01-01T00:00:00.000Z' });
    expect(built.diagnostics?.text).toBe('Version: 1.2.3');
    expect(built.diagnostics?.logs).toHaveLength(200);
    expect(built.diagnostics?.logs[0]).toEqual({ at: 1050, channel: 'app', level: 'info', message: 'line 50' });
    expect(built.diagnostics?.logs.at(-1)?.message).not.toContain('abc123secret');
  });

  it('leaves the diagnostics out when they are not attached', () => {
    const built = buildBugReportPayload({ title: 'a', description: 'b', product: PRODUCT, version: '1', diagnostics: null, system: null, logs: [entry(1, 'x')] });
    expect(built.diagnostics).toBeNull();
  });
});

describe('resolveBugReportTarget', () => {
  const send = vi.fn();

  it('prefers the app transport, then the main one, then the GitHub issue, then the clipboard', () => {
    expect(resolveBugReportTarget({ app: { transport: send, label: 'Send to the server' }, main: { label: 'Main' }, sendToMain: send, repo: REPO }))
      .toMatchObject({ kind: 'transport', label: 'Send to the server' });
    expect(resolveBugReportTarget({ app: { transport: send }, main: null, sendToMain: null, repo: REPO })).toMatchObject({ kind: 'transport', label: 'Send report' });
    expect(resolveBugReportTarget({ app: null, main: { label: 'Upload' }, sendToMain: send, repo: REPO })).toMatchObject({ kind: 'transport', label: 'Upload' });
    expect(resolveBugReportTarget({ app: null, main: null, sendToMain: send, repo: REPO })).toEqual({ kind: 'github', label: 'Open GitHub issue', repo: REPO });
    expect(resolveBugReportTarget({ app: null, main: null, sendToMain: null, repo: undefined })).toEqual({ kind: 'clipboard', label: 'Copy report' });
  });
});

describe('deliverReport', () => {
  it('hands the payload to the transport and returns its receipt, which the toast shows with a link to the report', async () => {
    const send = vi.fn().mockResolvedValue({ success: true, value: { message: 'Report 42 filed.', url: 'https://reports.example/42', id: '42' } });
    const result = await deliverReport({ kind: 'transport', label: 'Send', send }, payload());
    expect(result).toEqual({ sent: true, receipt: { message: 'Report 42 filed.', url: 'https://reports.example/42', id: '42' } });
    expect(send).toHaveBeenCalledWith(payload());
    if (result.sent) announceReceipt(result.receipt);
    expect(toasts[0]?.message).toBe('Report 42 filed.');
    toasts[0]?.options.action?.onSelect();
    expect(opened).toEqual(['https://reports.example/42']);
  });

  it('returns the error of a failed or throwing transport so the dialog stays open', async () => {
    const failed = vi.fn().mockResolvedValue({ success: false, error: 'offline' });
    expect(await deliverReport({ kind: 'transport', label: 'Send', send: failed }, payload())).toEqual({ sent: false, error: 'offline' });
    const thrown = vi.fn().mockRejectedValue(new Error('server said no'));
    expect(await deliverReport({ kind: 'transport', label: 'Send', send: thrown }, payload())).toEqual({ sent: false, error: 'server said no' });
    expect(toasts).toEqual([]);
  });

  it('keeps the GitHub issue as the default', async () => {
    const diagnostics = { text: 'Version: 1.0.0', system: null, logs: [] };
    expect(await deliverReport({ kind: 'github', label: 'Open GitHub issue', repo: REPO }, payload({ diagnostics }))).toMatchObject({ sent: true });
    expect(opened[0]).toMatch(/^https:\/\/github\.com\/someone\/my-app\/issues\/new\?/);
    expect(new URL(opened[0] ?? '').searchParams.get('body')).toContain('Version: 1.0.0');
  });
});

describe('the contact email and the attachments', () => {
  it('go into the payload only when given, the contact trimmed', () => {
    const file = { name: 'shot.png', type: 'image/png', bytes: new Uint8Array([1, 2, 3]) };
    const built = buildBugReportPayload({ title: 'a', description: 'b', product: PRODUCT, version: '1', diagnostics: null, system: null, logs: [], contact: ' me@example.com ', attachments: [file] });
    expect(built.contact).toBe('me@example.com');
    expect(built.attachments).toEqual([file]);
    const bare = buildBugReportPayload({ title: 'a', description: 'b', product: PRODUCT, version: '1', diagnostics: null, system: null, logs: [], contact: '  ', attachments: [] });
    expect('contact' in bare || 'attachments' in bare).toBe(false);
  });

  it('take a transport from main when the app only asks for the fields', () => {
    const send = vi.fn();
    expect(resolveBugReportTarget({ app: { contact: true }, main: { label: 'Upload' }, sendToMain: send, repo: REPO })).toMatchObject({ kind: 'transport', label: 'Upload' });
  });
});
