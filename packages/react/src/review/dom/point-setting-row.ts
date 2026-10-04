/* @layer renderer-shell @kind logic */
import { SELECTORS } from '../review.constants';
import { hover } from './hover';
import { waitFor } from './wait-for';

const hintOf = (row: HTMLElement): string | null => {
  const text = row.querySelector(SELECTORS.rowHint)?.textContent.trim() ?? '';
  return text === '' ? null : text;
};

const pointSettingRow = async (scope: ParentNode): Promise<{ hint: string | null; leave: () => void }> => {
  const row = scope.querySelector<HTMLElement>(SELECTORS.toggleRow) ?? scope.querySelector<HTMLElement>(SELECTORS.settingRow);
  const control = row?.querySelector<HTMLElement>(SELECTORS.rowFocusable);
  if (!row || !control) return { hint: null, leave: () => undefined };
  hover(control);
  control.focus();
  return { hint: await waitFor(() => hintOf(row)), leave: () => {
    control.blur();
    control.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, cancelable: true, view: window, relatedTarget: null }));
  } };
};

export { pointSettingRow };
