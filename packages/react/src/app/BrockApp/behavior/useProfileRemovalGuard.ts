/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { profileRemoval } from '../../../stores/profile-removal';
import type { BeforeProfileRemove } from '../../../stores/profiles.type';

const useProfileRemovalGuard = (guard: BeforeProfileRemove | undefined): void => {
  useEffect(() => (guard ? profileRemoval.add(guard) : undefined), [guard]);
};

export { useProfileRemovalGuard };
