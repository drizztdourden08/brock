/* @layer renderer-shell @kind logic */
const isBackChord = (e: KeyboardEvent): boolean => e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.key === 'ArrowLeft';

export { isBackChord };
