/* @layer core @kind logic */
import { profileDir } from './profile-dir';

const profileFile = (id: string): string => `${profileDir(id)}/profile.json`;

export { profileFile };
