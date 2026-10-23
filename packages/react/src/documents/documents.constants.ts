/* @layer renderer-shell @kind constants */
const RECENT_MENU_TEXT = {
  label: 'Recent',
  none: 'No recent documents',
  clear: 'Clear recent documents',
} as const;

const RECOVERY_TEXT = {
  title: 'Recover unsaved work',
  restore: 'Restore',
  discard: 'Discard',
  later: 'Later',
  unnamed: 'A document',
} as const;

export { RECENT_MENU_TEXT, RECOVERY_TEXT };
