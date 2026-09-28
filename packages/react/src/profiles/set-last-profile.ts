/* @layer renderer-shell @kind logic */
import { isAutomationLaunch } from '../host/is-automation-launch';
import { profileStore } from './profile-store';

const setLastProfile = (id: string): Promise<void> =>
  isAutomationLaunch() ? Promise.resolve() : profileStore().setLast(id);

export { setLastProfile };
