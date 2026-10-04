/* @layer electron-main @kind logic */
import { reachFrom } from './reach-from';
import { snapLinks } from './snap-links';

const linkCluster = (id: string): string[] => {
  const links = snapLinks.pairs();
  return reachFrom(id, (at) => snapLinks.around(links, at));
};

export { linkCluster };
