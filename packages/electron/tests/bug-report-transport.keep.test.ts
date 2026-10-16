/* @layer electron-main @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { BugReportPayload } from '@drizztdourden08/brock-core/types';
import { collectDebugFiles } from '../src/main/bug-report/collect-debug-files';
import { receiptWire } from '../src/main/bug-report/receipt-wire';
import { retryBugReport } from '../src/main/bug-report/retry-bug-report';
import { sendBugReport } from '../src/main/bug-report/send-bug-report';
import { transportInfo } from '../src/main/bug-report/transport-info';
import { writeDebugZip } from '../src/main/bug-report/write-debug-zip';
import { openZipReader } from '../src/main/storage/zip/open-zip-reader';
import type { MainContext } from '../src/main/types/main-context.type';

const PAYLOAD: BugReportPayload = {
  title: 'Crash', description: 'It closed.', app: { id: 'my-app', name: 'My App', version: '1.0.0' }, diagnostics: null, createdAt: '2026-10-07T00:00:00.000Z',
};

const roots: string[] = [];
const folder = (): string => {
  const dir = mkdtempSync(join(tmpdir(), 'brock-report-'));
  roots.push(dir);
  return dir;
};

afterEach(() => {
  for (const dir of roots.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const contextWith = (lines: string[]): MainContext => ({ log: (message: string) => { lines.push(message); } }) as Partial<MainContext> as MainContext;

describe('sendBugReport', () => {
  it('passes the payload and the context to the app transport', async () => {
    const transport = vi.fn().mockResolvedValue({ success: true, value: { id: '42' } });
    const ctx = contextWith([]);
    expect(await sendBugReport({ transport }, PAYLOAD, ctx)).toEqual({ success: true, value: { id: '42' } });
    expect(transport).toHaveBeenCalledWith(PAYLOAD, ctx);
  });

  it('answers with an error and logs it when there is no transport, it fails or it throws', async () => {
    const lines: string[] = [];
    expect(await sendBugReport(null, PAYLOAD, contextWith(lines))).toEqual({ success: false, error: 'This app has no report service.' });
    const failing = vi.fn().mockResolvedValue({ success: false, error: 'offline' });
    expect(await sendBugReport({ transport: failing }, PAYLOAD, contextWith(lines))).toEqual({ success: false, error: 'offline' });
    const throwing = vi.fn().mockRejectedValue(new Error('boom'));
    expect(await sendBugReport({ transport: throwing }, PAYLOAD, contextWith(lines))).toEqual({ success: false, error: 'boom' });
    expect(lines).toEqual(['bug report not sent: offline', 'bug report transport threw: boom']);
  });
});

describe('writeDebugZip', () => {
  it('zips the report, the log files of Data/debug and the app extras', async () => {
    const debug = folder();
    writeFileSync(join(debug, 'main-console.log'), 'main');
    writeFileSync(join(debug, 'session.log'), 'session');
    writeFileSync(join(debug, 'core.dmp'), 'x');
    mkdirSync(join(debug, 'old'));
    expect((await collectDebugFiles(debug)).map((file) => file.name)).toEqual(['main-console.log', 'session.log']);
    expect(await collectDebugFiles(join(debug, 'missing'))).toEqual([]);

    const target = join(folder(), 'report.zip');
    await writeDebugZip(target, debug, PAYLOAD, [{ name: 'save/slot-1.sav', data: Buffer.from([1, 2, 3]) }, { name: 'settings.json', data: '{}' }]);
    const zip = await openZipReader(target);
    try {
      expect(zip.records.map((record) => record.name)).toEqual(['report.json', 'logs/main-console.log', 'logs/session.log', 'save/slot-1.sav', 'settings.json']);
      const report = zip.records[0];
      if (!report) throw new Error('no report entry');
      expect(JSON.parse((await zip.read(report)).toString('utf8'))).toEqual(PAYLOAD);
    } finally {
      await zip.close();
    }
  });
});

describe('transportInfo', () => {
  const transport = vi.fn();

  it('tells the renderer the label and the fields the transport takes', async () => {
    expect(await transportInfo(null, contextWith([]))).toBeNull();
    expect(await transportInfo({ transport }, contextWith([]))).toEqual({ label: 'Send report' });
    expect(await transportInfo({ transport, label: 'Upload', contact: true, attachments: { maxFiles: 3 } }, contextWith([])))
      .toEqual({ label: 'Upload', contact: true, attachments: { maxFiles: 3 } });
    expect(await transportInfo({ transport, afterSend: 'view' }, contextWith([]))).toEqual({ label: 'Send report', afterSend: 'view' });
  });

  it('hides a transport that cannot send now, so the renderer falls back to the GitHub issue', async () => {
    const lines: string[] = [];
    expect(await transportInfo({ transport, available: () => false }, contextWith(lines))).toBeNull();
    expect(await transportInfo({ transport, available: () => Promise.resolve(true) }, contextWith(lines))).toEqual({ label: 'Send report' });
    expect(await transportInfo({ transport, available: () => { throw new Error('offline'); } }, contextWith(lines))).toBeNull();
    expect(lines).toEqual(['bug report availability check threw: offline']);
  });

  it('tells the renderer who is signed in, and leaves a blank or failing identity out', async () => {
    const lines: string[] = [];
    expect(await transportInfo({ transport, identity: () => Promise.resolve(' sam@example.com ') }, contextWith(lines)))
      .toEqual({ label: 'Send report', identity: 'sam@example.com' });
    expect(await transportInfo({ transport, identity: () => null }, contextWith(lines))).toEqual({ label: 'Send report' });
    expect(await transportInfo({ transport, identity: () => { throw new Error('no session'); } }, contextWith(lines))).toEqual({ label: 'Send report' });
    expect(lines).toEqual(['bug report identity threw: no session']);
  });
});

describe('receipt retry over IPC', () => {
  it('holds the retry in main, sends its id and runs it on bugReport:retry', async () => {
    const retry = vi.fn().mockResolvedValueOnce({ success: false, error: 'offline' }).mockResolvedValueOnce({ success: true, value: { message: 'Uploaded.' } });
    const wire = receiptWire({ success: true, value: { id: '9', links: [{ label: 'View', url: 'https://reports.example/9' }], retry } });
    if (!wire.success) throw new Error(wire.error);
    const { retryId } = wire.value;
    expect(wire.value).toEqual({ id: '9', links: [{ label: 'View', url: 'https://reports.example/9' }], retryId });
    if (retryId === undefined) throw new Error('no retry id');
    const lines: string[] = [];
    expect(await retryBugReport(retryId, contextWith(lines))).toEqual({ success: false, error: 'offline' });
    expect(await retryBugReport(retryId, contextWith(lines))).toEqual({ success: true, value: { message: 'Uploaded.' } });
    expect(await retryBugReport(retryId, contextWith(lines))).toEqual({ success: false, error: 'This report can no longer be retried.' });
    expect(lines).toEqual(['bug report not sent: offline']);
  });

  it('drops an older retry when a newer receipt comes back', () => {
    const first = receiptWire({ success: true, value: { retry: vi.fn() } });
    receiptWire({ success: true, value: { id: 'plain' } });
    expect(first.success && first.value.retryId).toBeTruthy();
    expect(receiptWire({ success: false, error: 'offline' })).toEqual({ success: false, error: 'offline' });
  });
});

describe('writeDebugZip attachments', () => {
  it('stores each attachment under attachments/ and keeps only its name, type and size in report.json', async () => {
    const dir = folder();
    const data = new Uint8Array([7, 8, 9]);
    const payload: BugReportPayload = {
      ...PAYLOAD, contact: 'me@example.com', extras: { screen: 'home' },
      attachments: [{ name: 'shot.png', type: 'image/png', size: 3, data }, { name: 'C:\\temp\\shot.png', type: 'image/png', size: 3, data }],
    };
    const target = join(dir, 'report.zip');
    await writeDebugZip(target, join(dir, 'missing'), payload);
    const zip = await openZipReader(target);
    try {
      expect(zip.records.map((record) => record.name)).toEqual(['report.json', 'attachments/shot.png', 'attachments/2-shot.png']);
      const [report, first] = zip.records;
      if (!report || !first) throw new Error('missing entries');
      const written = JSON.parse((await zip.read(report)).toString('utf8')) as BugReportPayload;
      expect(written.attachments).toEqual([{ name: 'shot.png', type: 'image/png', size: 3 }, { name: 'C:\\temp\\shot.png', type: 'image/png', size: 3 }]);
      expect(written.contact).toBe('me@example.com');
      expect(written.extras).toEqual({ screen: 'home' });
      expect([...(await zip.read(first))]).toEqual([7, 8, 9]);
    } finally {
      await zip.close();
    }
  });
});
