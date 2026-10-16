/* @layer electron-main @kind logic */
import type { VelopackAsset } from 'velopack';
import type { GithubRelease, UpdateFeed } from './update-feed.type';
import type { AssetTables, VersionCandidate } from './update-plan.type';
import { compareVersions } from './compare-versions';
import { fetchReleases } from './fetch-releases';
import { parseFeed } from './parse-feed';
import { planUpdate } from './plan-update';
import { releaseMetaOf } from './release-meta-of';
import { versionOfTag } from './version-of-tag';

const notesOf = (asset: VelopackAsset, release: GithubRelease): string =>
  (asset.NotesMarkdown.length > 0 ? asset.NotesMarkdown : (release.body ?? ''));

const feedUrlOf = (release: GithubRelease, feedFile: string): string | null =>
  release.assets?.find((a) => a.name === feedFile)?.browser_download_url ?? null;

const fetchOwnEntries = async (url: string, version: string): Promise<VelopackAsset[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not read the release index (${res.status})`);
  return parseFeed(await res.json()).filter((asset) => asset.Version === version);
};

const readAllFeeds = async (feed: UpdateFeed, releases: GithubRelease[]): Promise<VelopackAsset[]> => {
  const reads = releases.flatMap((release) => {
    const url = feedUrlOf(release, feed.feedFile);
    return url ? [fetchOwnEntries(url, versionOfTag(release.tag_name, feed.tagPrefix))] : [];
  });
  const settled = await Promise.allSettled(reads);
  if (settled.length > 0 && settled.every((read) => read.status === 'rejected')) {
    throw new Error('Could not read any release index');
  }
  return settled.flatMap((read) => (read.status === 'fulfilled' ? read.value : []));
};

const splitAssets = (assets: VelopackAsset[], known: ReadonlyMap<string, GithubRelease>): AssetTables => {
  const full = new Map<string, VelopackAsset>();
  const delta = new Map<string, VelopackAsset>();
  for (const asset of assets) {
    if (!known.has(asset.Version)) continue;
    (asset.Type.toLowerCase() === 'delta' ? delta : full).set(asset.Version, asset);
  }
  return { full, delta };
};

const candidateOf = (asset: VelopackAsset, release: GithubRelease, current: string, tables: AssetTables): VersionCandidate | null => {
  const plan = planUpdate({ ...tables, target: asset.Version, current });
  if (!plan) return null;
  const order = compareVersions(asset.Version, current);
  return {
    version: asset.Version,
    releaseNotes: notesOf(asset, release),
    releaseDate: release.published_at ?? '',
    release: releaseMetaOf(release),
    size: asset.Size,
    downloadSize: plan.downloadSize,
    prerelease: release.prerelease,
    downgrade: order < 0,
    installed: order === 0,
    plan,
  };
};

const listVersions = async (feed: UpdateFeed, current: string, allowPrerelease: boolean): Promise<VersionCandidate[]> => {
  const releases = await fetchReleases(feed, allowPrerelease);
  const byVersion = new Map(releases.map((r) => [versionOfTag(r.tag_name, feed.tagPrefix), r]));
  const tables = splitAssets(await readAllFeeds(feed, releases), byVersion);
  return [...tables.full.values()]
    .flatMap((asset) => {
      const release = byVersion.get(asset.Version);
      const candidate = release ? candidateOf(asset, release, current, tables) : null;
      return candidate ? [candidate] : [];
    })
    .sort((a, b) => compareVersions(b.version, a.version));
};

export { listVersions };
