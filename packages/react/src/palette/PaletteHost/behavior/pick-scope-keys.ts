/* @layer renderer-shell @kind logic */
import type { ScopeKeyEvent } from '../PaletteHost.type';

const scopeDirection = (event: ScopeKeyEvent): 1 | -1 | 0 => {
  if (event.key !== 'Tab' || event.ctrlKey || event.altKey || event.metaKey) return 0;
  return event.shiftKey ? -1 : 1;
};

export { scopeDirection };
