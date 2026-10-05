/* @layer renderer-shell @kind constants */
import type { ItemListRowParts } from '@drizztdourden08/tessera/composites';
import type { ProfilesPanelItem } from './ProfilesPanel.type';

const PROFILES_PANEL_TEXT = {
  list: 'Profiles',
  newProfile: 'New profile',
  placeholder: 'Profile name',
  empty: 'No profiles yet.',
} as const;

const PROFILE_ROW = {
  getId: (profile: ProfilesPanelItem): string => profile.id,
  getName: (profile: ProfilesPanelItem): string => profile.name,
  render: (profile: ProfilesPanelItem): ItemListRowParts => ({
    meta: profile.meta,
    icon: profile.icon,
    columns: profile.aside === undefined ? undefined : [{ primary: profile.aside, align: 'end' }],
  }),
};

export { PROFILE_ROW, PROFILES_PANEL_TEXT };
