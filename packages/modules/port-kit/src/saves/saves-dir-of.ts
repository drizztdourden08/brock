/* @layer core @kind logic */
import { assertSafeName, profileDir } from '@drizztdourden08/brock-core/storage';
import { SAVES_DIR } from './save-slot.constants';

const savesDirOf = (profileId: string, sub?: string): string => {
  const base = `${profileDir(profileId)}/${SAVES_DIR}`;
  return sub === undefined ? base : `${base}/${assertSafeName(sub, 'save folder')}`;
};

export { savesDirOf };
