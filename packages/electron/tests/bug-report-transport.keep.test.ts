/* @layer electron-main @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { BugReportPayload } from '@drizztdourden08/brock-core/types';
import { collectDebugFiles } from '../src/main/bug-report/collect-debug-files';
import { sendBugReport } from '../src/main/bug-report/send-bug-report';
import { writeDebugZip } from '../src/main/bug-report/write-debug-zip';
import { openZipReader } from '../src/main/storage/zip/open-zip-reader';
import type { MainContext } from '../src/main/types/main-context.type';

const PAYLOAD: BugReportPayload = {
  title: 'Crash', description: 'It closed.', app: { id: 'relic', name: 'Relic', version: '1.0.0' }, diagnostics: null, createdAt: '2026-10-07T00:00:00.000Z',
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
