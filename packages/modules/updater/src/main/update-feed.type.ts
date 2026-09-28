/* @layer electron-main @kind types */
interface UpdateFeed {
  repoUrl: string;
  releasesApi: string;
  releasePage: string;
  channel: string;
  feedFile: string;
  harness: boolean;
  localSource: string | null;
}

interface GithubAsset {
  name: string;
  browser_download_url: string;
}

interface GithubRelease {
  tag_name: string;
  body?: string;
  draft: boolean;
  prerelease: boolean;
  published_at?: string;
  assets?: GithubAsset[];
}

export type { UpdateFeed, GithubRelease };
