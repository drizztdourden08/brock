/* @layer renderer-shell @kind test */
import { describe, expect, it, vi } from 'vitest';
import { admitAttachments } from '../src/bug-report/admit-attachments';
import { buildBugReportPayload } from '../src/bug-report/build-bug-report-payload';
import { captureExtras } from '../src/bug-report/capture-extras';
import { resolveBugReportTarget } from '../src/bug-report/resolve-bug-report-target';
import { targetFields } from '../src/bug-report/target-fields';

const PRODUCT = { id: 'my-app', name: 'My App' };
const LIMITS = { maxFiles: 2, maxBytes: 100 };
const file = (name: string, size: number) => ({ name, size });

describe('targetFields', () => {
  it('turns the transport fields into limits, with defaults', () => {
    expect(targetFields({})).toEqual({ contact: false, attachments: null, afterSend: 'toast', identity: null });
    expect(targetFields({ contact: true, attachments: true, afterSend: 'view' }))
      .toEqual({ contact: true, attachments: { maxFiles: 5, maxBytes: 10 * 1024 * 1024 }, afterSend: 'view', identity: null });
    expect(targetFields({ attachments: { maxBytes: 1024 } }).attachments).toEqual({ maxFiles: 5, maxBytes: 1024 });
  });

  it('keeps the signed-in identity and drops a blank one', () => {
    expect(targetFields({ identity: ' sam@example.com ' }).identity).toBe('sam@example.com');
    expect(targetFields({ identity: '  ' }).identity).toBeNull();
    const send = vi.fn();
    expect(resolveBugReportTarget({ app: null, main: { label: 'Upload', identity: 'sam' }, sendToMain: send, repo: undefined }))
      .toMatchObject({ fields: { identity: 'sam' } });
  });

  it('takes the app config without a transport as no transport, so main or the issue still gets the report', () => {
    const send = vi.fn();
    expect(resolveBugReportTarget({ app: { label: 'Unused' }, main: { label: 'Upload' }, sendToMain: send, repo: undefined }))
      .toMatchObject({ kind: 'transport', label: 'Upload' });
    expect(resolveBugReportTarget({ app: {}, main: null, sendToMain: null, repo: undefined })).toEqual({ kind: 'clipboard', label: 'Copy report' });
  });

  it('reaches the target of an app or a main transport, never the GitHub issue', () => {
    const send = vi.fn();
    const repo = { owner: 'someone', name: 'my-app' };
    expect(resolveBugReportTarget({ app: null, main: { label: 'Upload', contact: true }, sendToMain: send, repo })).toMatchObject({ fields: { contact: true, attachments: null } });
    expect(resolveBugReportTarget({ app: { transport: send, attachments: true }, main: null, sendToMain: null, repo })).toMatchObject({ fields: { contact: false } });
    expect(resolveBugReportTarget({ app: null, main: null, sendToMain: send, repo })).not.toHaveProperty('fields');
  });
});

describe('admitAttachments', () => {
  it('takes files while the count and the total size fit', () => {
    expect(admitAttachments([], [file('a.png', 40), file('b.png', 50)], LIMITS)).toEqual({ admitted: [file('a.png', 40), file('b.png', 50)], refused: null });
  });

  it('refuses a file that would pass the size cap and keeps going', () => {
    const { admitted, refused } = admitAttachments([file('a.png', 40)], [file('big.zip', 80), file('c.txt', 10)], LIMITS);
    expect(admitted).toEqual([file('c.txt', 10)]);
    expect(refused).toMatch(/^big\.zip is too large/);
  });

  it('stops at the file count', () => {
    const { admitted, refused } = admitAttachments([file('a.png', 1), file('b.png', 1)], [file('c.png', 1)], LIMITS);
    expect(admitted).toEqual([]);
    expect(refused).toBe('Up to 2 files can be attached.');
  });
});

describe('buildBugReportPayload extras', () => {
  const base = { title: 'a', description: 'b', product: PRODUCT, version: '1', diagnostics: null, system: null, logs: [] };

  it('carries the contact, the attachments and the renderer extras only when given', () => {
    const data = new Uint8Array([1, 2]);
    const built = buildBugReportPayload({ ...base, contact: ' me@example.com ', attachments: [{ name: 'shot.png', type: 'image/png', size: 2, data }], extras: { screen: 'home' } });
    expect(built.contact).toBe('me@example.com');
    expect(built.attachments).toEqual([{ name: 'shot.png', type: 'image/png', size: 2, data }]);
    expect(built.extras).toEqual({ screen: 'home' });
    const bare = buildBugReportPayload({ ...base, contact: '  ', attachments: [] });
    expect(bare).not.toHaveProperty('contact');
    expect(bare).not.toHaveProperty('attachments');
    expect(bare).not.toHaveProperty('extras');
  });
});

describe('captureExtras', () => {
  it('reads the app source and never lets it fail the report', async () => {
    expect(await captureExtras(() => ({ screen: 'home' }))).toEqual({ screen: 'home' });
    expect(await captureExtras(() => Promise.resolve({ count: 2 }))).toEqual({ count: 2 });
    expect(await captureExtras(() => { throw new Error('busy'); })).toBeUndefined();
    expect(await captureExtras(null)).toBeUndefined();
  });
});
