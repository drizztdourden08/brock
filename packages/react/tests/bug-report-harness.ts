/* @layer renderer-shell @kind test */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { BugReportDialog } from '../src/bug-report/BugReportDialog';
import { useBugReportStore } from '../src/bug-report/useBugReportStore';

const state: { root: Root | null } = { root: null };

const mountDialog = (): void => {
  document.body.innerHTML = '<div id="host"></div>';
  state.root = createRoot(document.getElementById('host') as HTMLElement);
  act(() => state.root?.render(createElement(BugReportDialog)));
};

const unmountDialog = (): void => {
  act(() => state.root?.unmount());
  state.root = null;
  useBugReportStore.setState({ open: false, prefill: null, prefillIsDefault: false, appTransport: null });
  document.body.replaceChildren();
};

const type = (input: HTMLInputElement | HTMLTextAreaElement, value: string): void => {
  const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), 'value')?.set;
  act(() => {
    setter?.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
};

const button = (label: string): HTMLButtonElement | undefined =>
  [...document.querySelectorAll('button')].find((candidate) => candidate.textContent.trim() === label);

const textInputs = (): HTMLInputElement[] => [...document.querySelectorAll('input')].filter((input) => input.type !== 'checkbox' && input.type !== 'file');

const settle = (): Promise<void> => act(() => new Promise<void>((done) => { setTimeout(done, 0); }));

const fillReport = (): void => {
  const [title] = textInputs();
  const description = document.querySelector('textarea');
  if (!title || !description) throw new Error('the form fields are missing');
  type(title, 'Crash on save');
  type(description, 'The app closed when I saved.');
};

export { button, fillReport, mountDialog, settle, textInputs, type, unmountDialog };
