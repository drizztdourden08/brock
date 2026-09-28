/* @layer renderer-shell @kind logic */
import { profileStore } from './profile-store';

const writeConfig = (id: string, settings: Record<string, unknown>): Promise<void> =>
  profileStore().writeConfig(id, settings);

export { writeConfig };
