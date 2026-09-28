/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { buildIssueBody } from '../src/bug-report/build-issue-body';
import { buildIssueUrl } from '../src/bug-report/build-issue-url';
import type { IssueDraft } from '../src/bug-report/bug-report.type';

const REPO = { owner: 'someone', name: 'my-app' };

const draft = (extra: Partial<IssueDraft> = {}): IssueDraft => ({
  repo: REPO, title: 'Crash on start', description: 'It closes at once.', diagnostics: 'Version: 1.0.0', ...extra,
});

const bodyOf = (url: string): string => new URL(url).searchParams.get('body') ?? '';

describe('buildIssueBody', () => {
  it('keeps a bare description when nothing is attached', () => {
    expect(buildIssueBody('  broken  ', null)).toBe('broken');
  });

  it('folds the diagnostics into a collapsed code block', () => {
    const body = buildIssueBody('broken', 'Version: 1');
    expect(body).toContain('<details><summary>Diagnostics</summary>');
    expect(body).toContain('```text\nVersion: 1\n```');
  });
});

describe('buildIssueUrl', () => {
  it('points at the new issue form of the product repo with a prefilled title and body', () => {
    const url = new URL(buildIssueUrl(draft()));
    expect(`${url.origin}${url.pathname}`).toBe('https://github.com/someone/my-app/issues/new');
    expect(url.searchParams.get('title')).toBe('Crash on start');
    expect(bodyOf(url.href)).toContain('It closes at once.');
    expect(bodyOf(url.href)).toContain('Version: 1.0.0');
  });

  it('trims the diagnostics first to stay under the length limit', () => {
    const diagnostics = 'x'.repeat(20000);
    const url = buildIssueUrl(draft({ diagnostics }), 2000);
    expect(url.length).toBeLessThanOrEqual(2000);
    expect(bodyOf(url)).toContain('It closes at once.');
    expect(bodyOf(url)).toContain('(truncated)');
  });

  it('trims the description when it alone is too long', () => {
    const url = buildIssueUrl(draft({ description: 'y'.repeat(20000), diagnostics: null }), 1500);
    expect(url.length).toBeLessThanOrEqual(1500);
    expect(bodyOf(url)).toContain('(truncated)');
  });
});
