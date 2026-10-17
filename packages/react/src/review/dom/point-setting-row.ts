/* @layer renderer-shell @kind logic */
import { SELECTORS } from '../review.constants';
import type { PointedRow } from '../review.type';
import { hover } from './hover';
import { waitFor } from './wait-for';

const textOf = (element: Element | null): string | null => {
  const text = element?.textContent.trim() ?? '';
  return text === '' ? null : text;
};

const hasHints = (row: HTMLElement): boolean => [...row.querySelectorAll(SELECTORS.rowHints)].some((line) => textOf(line) !== null);

const hintOf = (row: HTMLElement): string | null => textOf(row.querySelector(SELECTORS.rowHint)) ?? textOf(row.querySelector(SELECTORS.rowRestHint));

const firstWithHints = (scope: ParentNode, selector: string): HTMLElement | undefined =>
  [...scope.querySelectorAll<HTMLElement>(selector)].find(hasHints);

const unpointed = (found: boolean): PointedRow => ({ found, hint: null, leave: () => undefined });

const pointSettingRow = async (scope: ParentNode): Promise<PointedRow> => {
  const row = firstWithHints(scope, SELECTORS.toggleRow) ?? firstWithHints(scope, SELECTORS.settingRow);
  if (!row) return unpointed(false);
  const control = row.querySelector<HTMLElement>(SELECTORS.rowFocusable);
  if (!control) return unpointed(true);
  hover(control);
  control.focus();
  return { found: true, hint: await waitFor(() => hintOf(row)), leave: () => {
    control.blur();
    control.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, cancelable: true, view: window, relatedTarget: null }));
  } };
};

export { pointSettingRow };
