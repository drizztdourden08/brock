/* @layer renderer-shell @kind logic */
import { profileStore } from './profile-store';

const readConfig = (id: string): Promise<Record<string, unknown> | null> => profileStore().readConfig(id);

export { readConfig };
