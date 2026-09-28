/* @layer electron-main @kind logic */
import { readJson, writeJson, profileDir } from '@drizztdourden08/brock-core/storage';
import type { PlaySession } from '@drizztdourden08/brock-core/types';
import type { HandlerGroup } from '../types/main-context.type';
import { MAX_SESSIONS } from './session-handlers.constants';

const sessionsFile = (profileId: string): string => `${profileDir(profileId)}/sessions.json`;

const sessionHandlers: HandlerGroup = {
  id: 'sessions',
  register: ({ handle, files }) => {
    handle('sessions:list', async (_event, profileId) => {
      const sessions = await readJson<PlaySession[]>(files, sessionsFile(profileId), []);
      return sessions.sort((a, b) => b.startedAt - a.startedAt);
    });

    handle('sessions:save', async (_event, profileId, session) => {
      const sessions = await readJson<PlaySession[]>(files, sessionsFile(profileId), []);
      sessions.push(session);
      await writeJson(files, sessionsFile(profileId), sessions.slice(-MAX_SESSIONS));
    });
  },
};

export { sessionHandlers };
