/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement, useEffect } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { BugReportPayload, BugReportReceipt, Result } from '@drizztdourden08/brock-core';
import { bugReport } from '../src/bug-report/bug-report';
import type { BugReportSectionProps } from '../src/bug-report/bug-report.type';
import { useBugReportStore } from '../src/bug-report/useBugReportStore';
import { button, fillReport, mountDialog, settle, textInputs, unmountDialog } from './bug-report-harness';

const target = vi.hoisted(() => ({
  payloads: [] as BugReportPayload[],
  opened: [] as string[],
  fields: { contact: true, attachments: null, afterSend: 'view', identity: null as string | null },
  answers: [] as Result<BugReportReceipt>[],
}));

vi.mock('../src/app/useProduct', () => ({ useProduct: () => ({ id: 'my-app', name: 'My App' }) }));
vi.mock('../src/diagnostics/useDebugText', () => ({ useDebugText: () => ({ text: 'Version: 1.0.0', system: null, version: '1.0.0', labels: {} }) }));
vi.mock('../src/toast/toast', () => ({ toast: () => 'toast-1' }));
vi.mock('../src/host/open-external', () => ({ openExternal: (url: string) => { target.opened.push(url); } }));
vi.mock('../src/bug-report/useBugReportTarget', () => ({
  useBugReportTarget: () => ({
    kind: 'transport',
    label: 'Send report',
    fields: target.fields,
    send: (payload: BugReportPayload) => {
      target.payloads.push(payload);
      return Promise.resolve(target.answers.shift() ?? { success: true, value: {} });
    },
  }),
}));

const send = async (): Promise<void> => {
  act(() => button('Send report')?.click());
  await settle();
};

const titleValue = (): string | undefined => textInputs()[0]?.value;

afterEach(() => {
  unmountDialog();
  target.payloads.length = 0;
  target.opened.length = 0;
  target.answers.length = 0;
  target.fields = { contact: true, attachments: null, afterSend: 'view', identity: null };
  useBugReportStore.setState({ extras: null });
});

describe('the app section of the bug report', () => {
  const Picker = (props: BugReportSectionProps) => {
    const { setExtras } = props;
    useEffect(() => setExtras({ picked: 'clip-2' }), [setExtras]);
    return createElement('span', { className: 'picker' }, 'Pick a clip');
  };

  it('renders below the form fields and adds its extras beside the app extras', async () => {
    useBugReportStore.setState({ appTransport: { section: Picker }, extras: () => ({ screen: 'home' }) });
    act(() => bugReport.open());
    mountDialog();
    const section = document.querySelector('.bug-report__section');
    const description = document.querySelector('textarea');
    expect(section?.textContent).toBe('Pick a clip');
    expect(description && section && description.compareDocumentPosition(section) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    fillReport();
    await send();
    expect(target.payloads[0]?.extras).toEqual({ screen: 'home', picked: 'clip-2' });
  });
});

describe('the prefilled title', () => {
  it('fills the title from open and clears it when the dialog closes', () => {
    mountDialog();
    act(() => bugReport.open({ title: 'Crash in the editor' }));
    expect(titleValue()).toBe('Crash in the editor');
    act(() => button('Cancel')?.click());
    expect(useBugReportStore.getState().prefill).toBeNull();
    act(() => bugReport.open());
    expect(titleValue()).toBe('');
  });

  it('takes a default title set before the dialog opens', () => {
    mountDialog();
    act(() => bugReport.setDefaultTitle('Import failed'));
    act(() => bugReport.open());
    expect(titleValue()).toBe('Import failed');
    act(() => bugReport.close());
    expect(useBugReportStore.getState().prefill).toBeNull();
  });
});

describe('the signed-in identity', () => {
  it('shows who reports in place of the contact field and sends no contact', async () => {
    target.fields = { ...target.fields, identity: 'sam@example.com' };
    act(() => bugReport.open());
    mountDialog();
    expect(document.querySelector('.bug-report__identity')?.textContent).toBe('Reporting as sam@example.com');
    expect(document.querySelector('input[type="email"]')).toBeNull();
    fillReport();
    await send();
    expect(target.payloads[0]).not.toHaveProperty('contact');
  });
});

describe('the receipt links and retry', () => {
  const retry = vi.fn<() => Promise<Result<BugReportReceipt>>>();
  const partial: BugReportReceipt = {
    message: 'Saved, but the upload failed.', url: 'https://reports.example/1', retry,
    links: [{ label: 'View report', url: 'https://reports.example/1' }, { label: 'Open folder', url: 'https://reports.example/files' }],
  };

  it('shows a button per link and retries until the upload goes through', async () => {
    target.answers.push({ success: true, value: partial });
    retry.mockResolvedValueOnce({ success: false, error: 'still offline' }).mockResolvedValueOnce({ success: true, value: { message: 'All uploaded.' } });
    act(() => bugReport.open());
    mountDialog();
    fillReport();
    await send();
    expect(button('Open')).toBeUndefined();
    act(() => button('Open folder')?.click());
    expect(target.opened).toEqual(['https://reports.example/files']);
    expect(button('View report')).toBeDefined();
    act(() => button('Retry upload')?.click());
    await settle();
    expect(document.body.textContent).toContain('The retry failed: still offline');
    act(() => button('Retry upload')?.click());
    await settle();
    expect(document.body.textContent).toContain('All uploaded.');
    expect(button('Retry upload')).toBeUndefined();
    expect(retry).toHaveBeenCalledTimes(2);
  });

  it('keeps the dialog on the receipt when a toast transport hands back a retry', async () => {
    target.fields = { ...target.fields, afterSend: 'toast' };
    target.answers.push({ success: true, value: partial });
    act(() => bugReport.open());
    mountDialog();
    fillReport();
    await send();
    expect(useBugReportStore.getState().open).toBe(true);
    expect(button('Retry upload')).toBeDefined();
  });
});
