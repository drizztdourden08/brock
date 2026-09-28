/* @layer electron-main @kind logic */
import type { UpdateFeed } from './update-feed.type';
import { RELEASE_TAG_PREFIX } from './updater-main.constants';

const releasePageUrl = (feed: UpdateFeed, version: string | null): string =>
  (version ? `${feed.releasePage}/tag/${RELEASE_TAG_PREFIX}${version}` : `${feed.releasePage}/latest`);

export { releasePageUrl };
