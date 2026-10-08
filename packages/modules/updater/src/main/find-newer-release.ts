/* @layer electron-main @kind logic */
import type { UpdateInfo } from '../updater.type';
import type { UpdateFeed } from './update-feed.type';
import { compareVersions } from './compare-versions';
import { fetchReleases } from './fetch-releases';
import { versionOfTag } from './version-of-tag';

const findNewerRelease = async (feed: UpdateFeed, current: string, allowPrerelease: boolean): Promise<UpdateInfo | null> => {
  const newest = (await fetchReleases(feed, allowPrerelease))
    .map((release) => ({ release, version: versionOfTag(release.tag_name, feed.tagPrefix) }))
    .sort((a, b) => compareVersions(b.version, a.version))[0];
  if (!newest || compareVersions(newest.version, current) <= 0) return null;
  return {
    version: newest.version,
    releaseNotes: newest.release.body ?? '',
    releaseDate: newest.release.published_at ?? '',
  };
};

export { findNewerRelease };
