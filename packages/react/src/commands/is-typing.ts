/* @layer renderer-shell @kind logic */
const isTyping = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

export { isTyping };
