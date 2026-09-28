/* @layer electron-main @kind logic */
import { getAppState } from '@drizztdourden08/brock-core/storage';
import type { HandlerGroup } from '../types/main-context.type';

const profileHandlers: HandlerGroup = {
  id: 'profiles',
  register: ({ handle, profiles, files }) => {
    handle('profiles:list', () => profiles.list());
    handle('profiles:create', (_event, opts) => profiles.create(opts));
    handle('profiles:delete', (_event, id) => profiles.remove(id));
    handle('profiles:setLast', (_event, id) => profiles.setLast(id));
    handle('profiles:getAppState', () => getAppState(files));
    handle('profiles:updateLastPlayed', (_event, id) => profiles.touch(id));
    handle('profiles:update', (_event, id, patch) => profiles.update(id, patch));

    handle('config:read', (_event, profileId) => profiles.readConfig(profileId));
    handle('config:write', (_event, profileId, settings) => profiles.writeConfig(profileId, settings));
  },
};

export { profileHandlers };
