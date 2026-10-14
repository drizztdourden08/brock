/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { BugReportPayload } from '@drizztdourden08/brock-core';
import { BugReportDialog } from '../src/bug-report/BugReportDialog';
import { useBugReportStore } from '../src/bug-report/useBugReportStore';

const sent = vi.hoisted(() => ({ payloads: [] as BugReportPayload[] }));

vi.mock('../src/app/useProduct', () => ({ useProduct: () => ({ id: 'my-app', name: 'My App' }) }));
vi.mock('../src/diagnostics/useDebugText', () => ({ useDebugText: () => ({ text: 'Version: 1.0.0', system: null, version: '1.0.0', labels: {} }) }));
vi.mock('../src/bug-report/useBugReportTarget', () => ({
  useBugReportTarget: () => ({
    kind: 'transport',
    label: 'Send report',
    send: (payload: BugReportPayload) => {
      sent.payloads.push(payload);
      return Promise.resolve({ success: true, value: { message: 'Thanks, we have it.', id: 'R-7' } });
    },
  }),
}));

let root: Root | null = null;

const type = (input: HTMLInputElement | HTMLTextAreaElement, value: string): void => {
  const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), 'value')?.set;
  act(() => {
    setter?.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
};

const button = (label: string): HTMLButtonElement | undefined =>
  [...document.querySelectorAll('button')].find((candidate) => candidate.textContent.trim() === label);

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  sent.payloads.length = 0;
  useBugReportStore.setState({ open: false, appTransport: null });
  document.body.replaceChildren();
});

describe('the bug report dialog with a contact field and the sent view', () => {
  it('asks for a valid email, sends it with the report and then shows the receipt in place of the form', async () => {
    useBugReportStore.setState({ open: true, appTransport: { contact: { required: true }, attachments: true, afterSend: 'view' } });
    document.body.innerHTML = '<div id="host"></div>';
    root = createRoot(document.getElementById('host') as HTMLElement);
    act(() => root?.render(createElement(BugReportDialog)));

    const [title, contact] = [...document.querySelectorAll('input')].filter((input) => input.type !== 'checkbox' && input.type !== 'file');
    const description = document.querySelector('textarea');
    if (!title || !contact || !description) throw new Error('the form fields are missing');
    expect(contact.type).toBe('email');
    type(title, 'Crash on save');
    type(description, 'The app closed when I saved.');
    type(contact, 'not an email');
    expect(button('Send report')?.disabled).toBe(true);
    expect(document.body.textContent).toContain('This is not an email address.');
    type(contact, 'me@example.com');
    expect(button('Send report')?.disabled).toBe(false);

    await act(async () => { button('Send report')?.click(); await Promise.resolve(); });
    expect(sent.payloads[0]).toMatchObject({ title: 'Crash on save', contact: 'me@example.com' });
    expect(document.body.textContent).toContain('Report sent');
    expect(document.body.textContent).toContain('Thanks, we have it.');
    expect(document.body.textContent).toContain('Report R-7');
    expect(button('Close')).toBeDefined();
  });
});
