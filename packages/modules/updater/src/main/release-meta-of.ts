/* @layer electron-main @kind logic */
import type { ReleaseMeta } from '../updater.type';
import type { GithubRelease } from './update-feed.type';

const releaseMetaOf = (release: GithubRelease): ReleaseMeta => ({
  tag: release.tag_name,
  name: release.name ?? release.tag_name,
  url: release.html_url ?? '',
  publishedAt: release.published_at ?? '',
  prerelease: release.prerelease,
  assets: (release.assets ?? []).map((asset) => ({
    name: asset.name,
    url: asset.browser_download_url,
    size: asset.size ?? 0,
    contentType: asset.content_type ?? '',
  })),
});

export { releaseMetaOf };
