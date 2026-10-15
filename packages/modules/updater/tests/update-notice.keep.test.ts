/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { releaseMetaOf } from '../src/main/release-meta-of';
import { resolveUpdateNotice } from '../src/renderer/resolve-update-notice';
import { noticeContext } from '../src/renderer/UpdateDialog/behavior/notice-context';
import { setUpdateNotice } from '../src/renderer/set-update-notice';
import { selfUpdateHost } from '../src/renderer/self-update-host';
import { useUpdaterStore } from '../src/renderer/useUpdaterStore';
import type { VersionChoice } from '../src/renderer/UpdateDialog/UpdateDialog.type';
import type { UpdateNoticeContext } from '../src/renderer/update-notice.type';

const CONTEXT: UpdateNoticeContext = { version: '2.0.0', currentVersion: '1.4.0', action: 'update', prerelease: false, releaseNotes: '', release: null };

const choiceOf = (version: string | null, prerelease = false): VersionChoice => ({
  selected: version ?? '',
  setSelected: () => undefined,
  groups: [],
  chosen: version ? { version, releaseNotes: '', releaseDate: '', size: 0, downloadSize: 0, prerelease, downgrade: false, installed: false } : null,
  isLatest: true,
  action: 'update',
});

describe('resolveUpdateNotice', () => {
  it('looks a version up in a keyed notice', () => {
    expect(resolveUpdateNotice({ '2.0.0': 'Saves are reset.' }, CONTEXT)).toBe('Saves are reset.');
    expect(resolveUpdateNotice({ '3.0.0': 'Later.' }, CONTEXT)).toBeNull();
  });

  it('hands the version to a notice function and drops an empty answer', () => {
    const notice = ({ version, currentVersion }: UpdateNoticeContext) => (version.startsWith('2.') && currentVersion.startsWith('1.') ? 'Major update.' : '');
    expect(resolveUpdateNotice(notice, CONTEXT)).toBe('Major update.');
    expect(resolveUpdateNotice(notice, { ...CONTEXT, currentVersion: '2.0.0' })).toBeNull();
  });

  it('shows nothing without a notice or a version', () => {
    expect(resolveUpdateNotice(null, CONTEXT)).toBeNull();
    expect(resolveUpdateNotice({ '2.0.0': 'x' }, null)).toBeNull();
  });
});

describe('noticeContext', () => {
  it('names the picked version, else the found one', () => {
    expect(noticeContext(choiceOf('1.9.0', true), null, '1.4.0')).toEqual({ version: '1.9.0', currentVersion: '1.4.0', action: 'update', prerelease: true, releaseNotes: '', release: null });
    expect(noticeContext(choiceOf(null), { version: '2.0.0', releaseNotes: '', releaseDate: '' }, '1.4.0')?.version).toBe('2.0.0');
    expect(noticeContext(choiceOf(null), null, '1.4.0')).toBeNull();
  });
});

describe('release metadata in the notice', () => {
  const github = {
    tag_name: 'v2.0.0',
    name: 'Atlas 2.0',
    html_url: 'https://github.com/acme/atlas/releases/tag/v2.0.0',
    draft: false,
    prerelease: false,
    published_at: '2026-10-01T12:00:00Z',
    assets: [
      { name: 'atlas-windows-setup.exe', browser_download_url: 'https://example.com/setup.exe', size: 600000, content_type: 'application/octet-stream' },
      { name: 'save-format.json', browser_download_url: 'https://example.com/save-format.json' },
    ],
  };

  it('maps a GitHub release to its name, page, date and assets', () => {
    expect(releaseMetaOf(github)).toEqual({
      tag: 'v2.0.0',
      name: 'Atlas 2.0',
      url: 'https://github.com/acme/atlas/releases/tag/v2.0.0',
      publishedAt: '2026-10-01T12:00:00Z',
      prerelease: false,
      assets: [
        { name: 'atlas-windows-setup.exe', url: 'https://example.com/setup.exe', size: 600000, contentType: 'application/octet-stream' },
        { name: 'save-format.json', url: 'https://example.com/save-format.json', size: 0, contentType: '' },
      ],
    });
    expect(releaseMetaOf({ tag_name: 'v1.0.0', draft: false, prerelease: true }).name).toBe('v1.0.0');
  });

  it('hands the chosen release and its assets to a notice function', () => {
    const release = releaseMetaOf(github);
    const choice = choiceOf('2.0.0');
    const chosen = choice.chosen ? { ...choice.chosen, releaseNotes: 'Notes', release } : null;
    const context = noticeContext({ ...choice, chosen }, null, '1.4.0');
    expect(context?.release?.assets.map((asset) => asset.name)).toEqual(['atlas-windows-setup.exe', 'save-format.json']);
    expect(context?.releaseNotes).toBe('Notes');
    const notice = ({ release: meta }: UpdateNoticeContext) => (meta?.assets.some((asset) => asset.name === 'save-format.json') ? 'Back up your files first.' : null);
    expect(resolveUpdateNotice(notice, context)).toBe('Back up your files first.');
  });

  it('falls back to the found update and its release', () => {
    const release = releaseMetaOf(github);
    expect(noticeContext(choiceOf(null), { version: '2.0.0', releaseNotes: 'n', releaseDate: '', release }, '1.4.0')?.release).toBe(release);
  });
});

describe('setUpdateNotice', () => {
  it('stores the notice and clears only its own on undo', () => {
    const first = { '2.0.0': 'first' };
    const undoFirst = setUpdateNotice(first);
    const second = { '2.0.0': 'second' };
    setUpdateNotice(second);
    undoFirst();
    expect(useUpdaterStore.getState().notice).toBe(second);
    setUpdateNotice(null);
  });
});

describe('selfUpdateHost', () => {
  const scope = globalThis as { window?: unknown };
  afterEach(() => { delete scope.window; });

  it('needs the updater bridge and a host that can update itself', () => {
    expect(selfUpdateHost({ selfUpdate: true })).toBe(false);
    scope.window = { api: { updater: {} } };
    expect(selfUpdateHost({ selfUpdate: true })).toBe(true);
    expect(selfUpdateHost({ selfUpdate: false })).toBe(false);
    expect(selfUpdateHost()).toBe(true);
  });
});
