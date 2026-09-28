/* @layer renderer-shell @kind component */
import { defineScreen } from '../define-screen';
import { ProfilesScreen } from '../../shell/ProfilesScreen/ProfilesScreen';

const profilesScreen = defineScreen({
  id: 'profiles',
  title: 'Profiles',
  requiresProfile: false,
  render: () => <ProfilesScreen />,
});

export { profilesScreen };
