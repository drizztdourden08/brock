/* @layer renderer-shell @kind logic */
interface ScopeKeyEvent {
  key: string;
  shiftKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  metaKey: boolean;
}

const scopeDirection = (event: ScopeKeyEvent): 1 | -1 | 0 => {
  if (event.key !== 'Tab' || event.ctrlKey || event.altKey || event.metaKey) return 0;
  return event.shiftKey ? -1 : 1;
};

export { scopeDirection };
