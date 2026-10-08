/* @layer electron-main @kind logic */
import type { UpdateFeed } from './update-feed.type';

const releasePageUrl = (feed: UpdateFeed, version: string | null): string =>
  (version ? `${feed.releasePage}/tag/${feed.tagPrefix}${version}` : `${feed.releasePage}/latest`);

export { releasePageUrl };
