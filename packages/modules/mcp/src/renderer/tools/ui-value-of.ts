/* @layer renderer-shell @kind logic */
import { READ_UI_NO_VALUE_TYPES, READ_UI_SECRET_AUTOCOMPLETE, READ_UI_VALUE_CHARS } from './read-ui.constants';

const secretField = (el: HTMLInputElement): boolean => {
  const autocomplete = el.autocomplete.toLowerCase();
  return READ_UI_NO_VALUE_TYPES.includes(el.type) || READ_UI_SECRET_AUTOCOMPLETE.some((prefix) => autocomplete.startsWith(prefix));
};

const rawValueOf = (el: Element): string | undefined => {
  if (el instanceof HTMLInputElement) return secretField(el) ? undefined : el.value;
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) return el.value;
  return undefined;
};

const uiValueOf = (el: Element): string | undefined => rawValueOf(el)?.slice(0, READ_UI_VALUE_CHARS);

export { uiValueOf };
