/* @layer renderer-shell @kind constants */
const PROFILES_PANEL_TEXT = {
  newProfile: 'New profile',
  placeholder: 'Profile name',
  renameSubmit: 'Rename',
  keep: 'Keep',
  rename: (name: string) => `Rename ${name}`,
  remove: (name: string) => `Delete ${name}`,
} as const;

export { PROFILES_PANEL_TEXT };
