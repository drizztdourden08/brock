/* @layer core @kind logic */
import { assertSafeName } from '../assert-safe-name';

const profileDir = (id: string): string => `profiles/${assertSafeName(id, 'profile id')}`;

export { profileDir };
