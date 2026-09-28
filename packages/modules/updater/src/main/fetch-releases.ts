/* @layer electron-main @kind logic */
import type { GithubRelease, UpdateFeed } from './update-feed.type';
import { GITHUB_JSON, RELEASE_PAGE_SIZE } from './updater-main.constants';

const fetchReleases = async (feed: UpdateFeed, allowPrerelease: boolean): Promise<GithubRelease[]> => {
  const res = await fetch(`${feed.releasesApi}?per_page=${RELEASE_PAGE_SIZE}`, { headers: GITHUB_JSON });
  if (!res.ok) throw new Error(`Could not read the release list (${res.status})`);
  const releases = (await res.json()) as GithubRelease[];
  return releases.filter((r) => !r.draft && (allowPrerelease || !r.prerelease));
};

export { fetchReleases };
