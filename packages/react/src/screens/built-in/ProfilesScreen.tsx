/* @layer renderer-shell @kind component */
import { Icon } from '@drizztdourden08/tessera/primitives';
import { defineScreen } from '../define-screen';
import { ProfilesScreen } from '../../shell/ProfilesScreen/ProfilesScreen';

const profilesScreen = defineScreen({
  id: 'profiles',
  title: 'Profiles',
  icon: <Icon name="users" />,
  requiresProfile: false,
  render: () => <ProfilesScreen />,
});

export { profilesScreen };
