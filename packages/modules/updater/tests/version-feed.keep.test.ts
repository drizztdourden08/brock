/* @layer electron-main @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { UpdateManager } from 'velopack';
import { listVersions } from '../src/main/list-versions';
import { runCheck } from '../src/main/run-check';
import type { GithubRelease, UpdateFeed } from '../src/main/update-feed.type';
import type { UpdaterRuntime } from '../src/main/updater-main.type';

vi.mock('electron', () => ({ app: { isPackaged: true, getVersion: () => '0.0.0' } }));

const FEED: UpdateFeed = {
  repoUrl: 'https://github.com/acme/atlas',
  releasesApi: 'https://api.github.com/repos/acme/atlas/releases',
  releasePage: 'https://github.com/acme/atlas/releases',
  channel: 'win',
  feedFile: 'releases.win.json',
  tagPrefix: 'v',
  harness: false,
  localSource: null,
};

const indexUrl = (version: string, file = 'releases.win.json') => `https://example.test/v${version}/${file}`;

const release = (version: string, prerelease = false, file = 'releases.win.json'): GithubRelease => ({
  tag_name: `v${version}`,
  draft: false,
  prerelease,
  assets: [{ name: file, browser_download_url: indexUrl(version, file) }],
});

const asset = (version: string) => ({ Version: version, Type: 'Full', FileName: `atlas-${version}-full.nupkg`, Size: 100, NotesMarkdown: '' });

type Indexes = Record<string, string[] | 'fail'>;

const serve = (releases: GithubRelease[], indexes: Indexes) => {
  const fetchMock = vi.fn((url: string) => {
    if (url.startsWith(FEED.releasesApi)) return Promise.resolve(new Response(JSON.stringify(releases)));
    const listed = indexes[url];
    if (listed === undefined || listed === 'fail') return Promise.resolve(new Response('', { status: 404 }));
    return Promise.resolve(new Response(JSON.stringify({ Assets: listed.map(asset) })));
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

const HOTFIX_AHEAD = [release('1.4.2'), release('1.5.0-beta.1', true)];
const HOTFIX_INDEXES: Indexes = {
  [indexUrl('1.4.2')]: ['1.4.2', '1.4.1'],
  [indexUrl('1.5.0-beta.1')]: ['1.5.0-beta.1', '1.4.0'],
};

const versionsOf = async (current: string, allowPrerelease: boolean) =>
  (await listVersions(FEED, current, allowPrerelease)).map((v) => v.version);

afterEach(() => { vi.unstubAllGlobals(); });

describe('version list across release indexes', () => {
  it('finds an older pre-release missing from the newest stable index', async () => {
    serve(HOTFIX_AHEAD, HOTFIX_INDEXES);
    expect(await versionsOf('1.4.1', false)).toEqual(['1.4.2']);
    const optedIn = await listVersions(FEED, '1.4.1', true);
    expect(optedIn.map((v) => v.version)).toEqual(['1.5.0-beta.1', '1.4.2']);
    expect(optedIn[0]?.prerelease).toBe(true);
    expect(optedIn[0]?.plan.target.FileName).toBe('atlas-1.5.0-beta.1-full.nupkg');
  });

  it('keeps only each release entry from its own index, across mixed channels', async () => {
    const releases = [release('2.1.0'), release('2.1.0-rc.1', true), release('2.0.1'), release('2.0.0-beta.2', true), release('2.0.0'), release('1.9.0', false, 'releases.linux.json')];
    const fetchMock = serve(releases, {
      [indexUrl('2.1.0')]: ['2.1.0', '2.0.1', '2.0.0'],
      [indexUrl('2.1.0-rc.1')]: ['2.1.0-rc.1', '2.0.0-beta.2', '2.0.0', '1.8.0'],
      [indexUrl('2.0.1')]: ['2.0.1', '2.0.0'],
      [indexUrl('2.0.0-beta.2')]: ['2.0.0-beta.2', '2.0.0'],
      [indexUrl('2.0.0')]: ['2.0.0', '1.9.0'],
    });
    expect(await versionsOf('2.0.0', false)).toEqual(['2.1.0', '2.0.1', '2.0.0']);
    expect(await versionsOf('2.0.0', true)).toEqual(['2.1.0', '2.1.0-rc.1', '2.0.1', '2.0.0', '2.0.0-beta.2']);
    expect(fetchMock.mock.calls.map(([url]) => url)).not.toContain(indexUrl('1.9.0', 'releases.linux.json'));
  });

  it('lists what it could read when one index read fails', async () => {
    serve(HOTFIX_AHEAD, { ...HOTFIX_INDEXES, [indexUrl('1.4.2')]: 'fail' });
    expect(await versionsOf('1.4.1', true)).toEqual(['1.5.0-beta.1']);
  });

  it('throws only when every index read fails', async () => {
    serve(HOTFIX_AHEAD, { [indexUrl('1.4.2')]: 'fail', [indexUrl('1.5.0-beta.1')]: 'fail' });
    await expect(listVersions(FEED, '1.4.1', true)).rejects.toThrow('Could not read any release index');
    serve([{ ...release('1.4.2'), assets: [] }], {});
    expect(await versionsOf('1.4.1', true)).toEqual([]);
  });
});

const runtimeOn = (current: string, allowPrerelease: boolean) => {
  const checkForUpdatesAsync = vi.fn();
  const fake: Pick<UpdateManager, 'getCurrentVersion' | 'checkForUpdatesAsync'> = { getCurrentVersion: () => current, checkForUpdatesAsync };
  const manager = fake as UpdateManager;
  const emit = vi.fn();
  const rt: UpdaterRuntime = {
    ctx: { emit, log: vi.fn() },
    feed: FEED,
    state: { prefs: { allowPrerelease }, available: null, versions: [] },
    manager: () => manager,
  };
  return { rt, emit, checkForUpdatesAsync };
};

describe('update check from the version list', () => {
  it('offers the pre-release behind a newer stable hotfix only to those who opted in', async () => {
    serve(HOTFIX_AHEAD, HOTFIX_INDEXES);
    const optedIn = runtimeOn('1.4.1', true);
    expect((await runCheck(optedIn.rt))?.version).toBe('1.5.0-beta.1');
    expect(optedIn.rt.state.versions[0]?.version).toBe('1.5.0-beta.1');
    expect(optedIn.emit).toHaveBeenCalledWith('updater:updateAvailable', expect.objectContaining({ version: '1.5.0-beta.1' }));
    expect(optedIn.checkForUpdatesAsync).not.toHaveBeenCalled();

    const stableOnly = runtimeOn('1.4.1', false);
    expect((await runCheck(stableOnly.rt))?.version).toBe('1.4.2');
  });

  it('is up to date when nothing listed is newer, and reports a list it cannot read', async () => {
    serve(HOTFIX_AHEAD, HOTFIX_INDEXES);
    const latest = runtimeOn('1.4.2', false);
    expect(await runCheck(latest.rt)).toBeNull();
    expect(latest.emit).toHaveBeenCalledWith('updater:upToDate');

    serve(HOTFIX_AHEAD, {});
    const broken = runtimeOn('1.4.1', true);
    expect(await runCheck(broken.rt)).toBeNull();
    expect(broken.emit).toHaveBeenCalledWith('updater:error', 'Could not read any release index');
  });
});
