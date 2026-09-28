/* @layer core @kind logic */
import { profileDir } from './profile-dir';

const configFile = (id: string): string => `${profileDir(id)}/config.json`;

export { configFile };
