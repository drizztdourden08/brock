/* @layer renderer-shell @kind logic */
import { requireHostApi } from '@drizztdourden08/brock-react';

const profileNameFlag = (): string | null => {
  const raw = requireHostApi().startup.flags['profile-name'];
  if (typeof raw !== 'string' || raw.trim() === '') return null;
  return raw.trim();
};

export { profileNameFlag };
