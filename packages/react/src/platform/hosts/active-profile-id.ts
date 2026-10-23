/* @layer renderer-shell @kind logic */
import { useProfilesStore } from '../../stores/useProfilesStore';

const activeProfileId = (): string | null => useProfilesStore.getState().active?.id ?? null;

export { activeProfileId };
