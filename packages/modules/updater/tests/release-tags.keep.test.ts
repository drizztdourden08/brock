/* @layer electron-main @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchReleases } from '../src/main/fetch-releases';
import { releasePageUrl } from '../src/main/release-page-url';
import type { GithubRelease, UpdateFeed } from '../src/main/update-feed.type';
import { versionOfTag } from '../src/main/version-of-tag';

const feedWith = (tagPrefix: string): UpdateFeed => ({
  repoUrl: 'https://github.com/acme/atlas',
  releasesApi: 'https://api.github.com/repos/acme/atlas/releases',
  releasePage: 'https://github.com/acme/atlas/releases',
  channel: 'win',
  feedFile: 'releases.win.json',
  tagPrefix,
  harness: false,
  localSource: null,
});

const release = (tag: string, prerelease = false): GithubRelease => ({ tag_name: tag, draft: false, prerelease });

const RELEASES = [release('desktop-v1.3.0'), release('tools-v2.0.0'), release('v1.2.0'), release('v1.3.0-beta.1', true), release('sdl3-addon-v1.1.0')];

afterEach(() => { vi.unstubAllGlobals(); });

const listed = async (tagPrefix: string, allowPrerelease: boolean) => {
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response(JSON.stringify(RELEASES)))));
  return (await fetchReleases(feedWith(tagPrefix), allowPrerelease)).map((r) => r.tag_name);
};

describe('release tags', () => {
  it('keeps the releases of this app only, and its pre-releases only when asked', async () => {
    expect(await listed('v', false)).toEqual(['v1.2.0']);
    expect(await listed('v', true)).toEqual(['v1.2.0', 'v1.3.0-beta.1']);
    expect(await listed('desktop-v', true)).toEqual(['desktop-v1.3.0']);
  });

  it('reads the version after the prefix and links the tag page with it', () => {
    expect(versionOfTag('desktop-v1.3.0', 'desktop-v')).toBe('1.3.0');
    expect(versionOfTag('v1.2.0', 'v')).toBe('1.2.0');
    expect(releasePageUrl(feedWith('desktop-v'), '1.3.0')).toBe('https://github.com/acme/atlas/releases/tag/desktop-v1.3.0');
  });
});
