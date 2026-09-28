/* @layer renderer-shell @kind logic */
import { profileStore } from './profile-store';

const deleteProfile = (id: string): Promise<void> => profileStore().remove(id);

export { deleteProfile };
