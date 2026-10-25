/* @layer renderer-shell @kind logic */
import { isAutomationLaunch } from '../host/is-automation-launch';
import { instanceProfile } from '../host/instance-profile';
import { isInstanceLaunch } from '../host/is-instance-launch';
import { profileStore } from './profile-store';

const setLastProfile = (id: string): Promise<void> =>
  isAutomationLaunch() || isInstanceLaunch() || instanceProfile() !== null ? Promise.resolve() : profileStore().setLast(id);

export { setLastProfile };
