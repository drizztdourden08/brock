/* @layer renderer-shell @kind hook */
import { useBrock } from '../../app/useBrock';
import type { ProfileModeDef } from './profile-mode.type';

const useProfileModes = (): readonly ProfileModeDef[] => useBrock().profileModes;

export { useProfileModes };
