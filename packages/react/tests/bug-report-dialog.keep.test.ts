/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { BugReportPayload } from '@drizztdourden08/brock-core';
import { useBugReportStore } from '../src/bug-report/useBugReportStore';
import { button, fillReport, mountDialog, settle, textInputs, type, unmountDialog } from './bug-report-harness';

const sent = vi.hoisted(() => ({ payloads: [] as BugReportPayload[], afterSend: 'view', toasts: [] as string[] }));

vi.mock('../src/app/useProduct', () => ({ useProduct: () => ({ id: 'my-app', name: 'My App' }) }));
vi.mock('../src/diagnostics/useDebugText', () => ({ useDebugText: () => ({ text: 'Version: 1.0.0', system: null, version: '1.0.0', labels: {} }) }));
vi.mock('../src/toast/toast', () => ({ toast: (message: string) => { sent.toasts.push(message); return 'toast-1'; } }));
vi.mock('../src/bug-report/useBugReportTarget', () => ({
  useBugReportTarget: () => ({
    kind: 'transport',
    label: 'Send report',
    fields: { contact: true, attachments: null, afterSend: sent.afterSend, identity: null },
    send: (payload: BugReportPayload) => {
      sent.payloads.push(payload);
      return Promise.resolve({ success: true, value: { message: 'Thanks, we have it.', id: 'R-7' } });
    },
  }),
}));

const fillAndSend = async (): Promise<void> => {
  useBugReportStore.setState({ open: true });
  mountDialog();
  fillReport();
  const contact = textInputs()[1];
  if (!contact) throw new Error('the contact field is missing');
  expect(contact.type).toBe('email');
  type(contact, 'me@example.com');
  act(() => button('Send report')?.click());
  await settle();
};

afterEach(() => {
  unmountDialog();
  sent.payloads.length = 0;
  sent.toasts.length = 0;
  sent.afterSend = 'view';
});

describe('the bug report dialog after sending', () => {
  it('shows the receipt in place of the form when the transport asks for the view', async () => {
    await fillAndSend();
    expect(sent.payloads[0]).toMatchObject({ title: 'Crash on save', contact: 'me@example.com' });
    expect(document.body.textContent).toContain('Report sent');
    expect(document.body.textContent).toContain('Thanks, we have it.');
    expect(document.body.textContent).toContain('Report R-7');
    expect(sent.toasts).toEqual([]);
    act(() => button('Close')?.click());
    expect(useBugReportStore.getState().open).toBe(false);
  });

  it('closes and raises the toast by default', async () => {
    sent.afterSend = 'toast';
    await fillAndSend();
    expect(sent.payloads).toHaveLength(1);
    expect(sent.toasts).toEqual(['Thanks, we have it.']);
    expect(useBugReportStore.getState().open).toBe(false);
  });
});
