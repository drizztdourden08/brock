/* @layer renderer-shell @kind logic */
import { READ_UI_NAME_CHARS } from './read-ui.constants';

const squash = (text: string | null | undefined): string => (text ?? '').replace(/\s+/g, ' ').trim();

const labelledBy = (el: Element): string => {
  const ids = el.getAttribute('aria-labelledby')?.split(/\s+/) ?? [];
  return ids.map((id) => el.ownerDocument.getElementById(id)?.textContent ?? '').join(' ');
};

const labelsOf = (el: Element): string => {
  const labels = el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement ? el.labels : null;
  return labels === null ? '' : [...labels].map((label) => label.textContent).join(' ');
};

const buttonValueOf = (el: Element): string => (el instanceof HTMLInputElement && ['button', 'submit', 'reset'].includes(el.type) ? el.value : '');

const uiNameOf = (el: Element): string => {
  const candidates = [
    el.getAttribute('aria-label'), labelledBy(el), labelsOf(el), buttonValueOf(el),
    el.textContent, el.getAttribute('placeholder'), el.getAttribute('title'),
  ];
  const found = candidates.map(squash).find((text) => text !== '');
  return (found ?? '').slice(0, READ_UI_NAME_CHARS);
};

export { uiNameOf };
