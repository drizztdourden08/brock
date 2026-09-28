/* @layer renderer-shell @kind logic */
import { profileStore } from './profile-store';

const touchProfile = (id: string): Promise<void> => profileStore().touch(id);

export { touchProfile };
