/* @layer renderer-shell @kind logic */
const isShortcutsChord = (event: KeyboardEvent): boolean =>
  (event.ctrlKey || event.metaKey) && !event.altKey && (event.key === '/' || event.code === 'Slash');

export { isShortcutsChord };
