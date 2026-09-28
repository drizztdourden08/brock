/* @layer electron-main @kind logic */
import { FileSource, GithubSource, UpdateManager } from 'velopack';
import type { UpdateFeed } from './update-feed.type';
import { MAX_DELTAS } from './updater-main.constants';

const sourceOf = (feed: UpdateFeed, allowPrerelease: boolean): FileSource | GithubSource =>
  (feed.localSource
    ? new FileSource(feed.localSource)
    : new GithubSource(feed.repoUrl, undefined, allowPrerelease));

const buildManager = (feed: UpdateFeed, allowPrerelease: boolean, explicitChannel: string | undefined): UpdateManager | null => {
  try {
    return new UpdateManager(sourceOf(feed, allowPrerelease), {
      AllowVersionDowngrade: true,
      MaximumDeltasBeforeFallback: MAX_DELTAS,
      ...(explicitChannel === undefined ? {} : { ExplicitChannel: explicitChannel }),
    });
  } catch {
    return null;
  }
};

const createManagerCache = (feed: UpdateFeed | null, explicitChannel?: string): ((allowPrerelease: boolean) => UpdateManager | null) => {
  const built = new Map<boolean, UpdateManager | null>();
  return (allowPrerelease) => {
    if (!feed) return null;
    if (!built.has(allowPrerelease)) built.set(allowPrerelease, buildManager(feed, allowPrerelease, explicitChannel));
    return built.get(allowPrerelease) ?? null;
  };
};

export { createManagerCache };
