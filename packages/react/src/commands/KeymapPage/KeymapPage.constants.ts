/* @layer renderer-shell @kind constants */
const KEYMAP_STRINGS = {
  hint: 'Click the keys, then press the new shortcut. Escape cancels.',
  clear: 'Clear',
  conflict: 'Also used by',
  also: 'Also',
  hold: 'Hold the key. It acts for as long as you press it.',
  only: 'Only in',
  sameKeys: 'The same keys also mean',
  resetAllSection: 'All shortcuts',
  resetAllTitle: 'Reset all shortcuts',
  resetAllHint: 'Puts every command back on its default keys.',
  resetAll: 'Reset all',
  resetAllConfirm: 'Put every shortcut back on its default keys?',
} as const;

const KEYMAP_SECTION_PREFIX = 'keymap-';

export { KEYMAP_SECTION_PREFIX, KEYMAP_STRINGS };
