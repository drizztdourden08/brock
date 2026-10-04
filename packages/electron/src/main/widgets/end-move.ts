/* @layer electron-main @kind logic */
import { joinCluster } from './join-cluster';
import { moveSession } from './move-session';

const endMove = (id: string): void => {
  const link = moveSession.end(id)?.hit?.link ?? null;
  if (link) joinCluster(id, link);
};

export { endMove };
