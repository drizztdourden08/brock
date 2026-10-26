/* @layer renderer-shell @kind logic */
import { menuTriggerOf } from './menu-trigger-of';
import { MENU_OPEN_ATTRIBUTE } from './tours.constants';

const isOpen = (trigger: HTMLElement): boolean => trigger.getAttribute(MENU_OPEN_ATTRIBUTE) === 'true';

const openStepMenu = (id: string, signal: AbortSignal): void => {
  const trigger = menuTriggerOf(id);
  if (!trigger || signal.aborted) return;
  if (!isOpen(trigger)) trigger.click();
  signal.addEventListener('abort', () => { if (isOpen(trigger)) trigger.click(); }, { once: true });
};

export { openStepMenu };
