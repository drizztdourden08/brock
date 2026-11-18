/* @layer renderer-shell @kind component */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { Icon } from '@drizztdourden08/tessera/primitives';
import { defineScreen } from '../define-screen';
import { ProfilesScreen } from '../../shell/ProfilesScreen/ProfilesScreen';

const profilesScreen = defineScreen({
  id: 'profiles',
  title: msg('brock-app:screens.profiles'),
  icon: <Icon name="users" />,
  requiresProfile: false,
  render: () => <ProfilesScreen />,
});

export { profilesScreen };
