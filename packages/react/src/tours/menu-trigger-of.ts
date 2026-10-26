/* @layer renderer-shell @kind logic */
import { APP_MENU_ID, MENU_TRIGGER_PART, QUOTED, SHELL_TARGETS } from './tours.constants';

const menuTriggerOf = (id: string): HTMLElement | null => {
  const selector = id === APP_MENU_ID ? SHELL_TARGETS.menu : `.window-title-bar [data-bar-item="action:${id.replace(QUOTED, '\\$&')}"] ${MENU_TRIGGER_PART}`;
  return document.querySelector<HTMLElement>(selector);
};

export { menuTriggerOf };
