/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { aboutChecks } from '../src/review/checks/about-checks';
import type { ReviewOutcome } from '../src/review/review.type';

const failed = (outcomes: readonly ReviewOutcome[]): string[] => outcomes.filter((o) => !o.pass).map((o) => o.id);
const reasonOf = (outcomes: readonly ReviewOutcome[], id: string): string | undefined => outcomes.find((o) => o.id === id)?.reason;

describe('aboutChecks', () => {
  it('compares the version row with the app version', () => {
    expect(failed(aboutChecks({ logoLoaded: true, version: '1.0.0', appVersion: '1.0.0' }))).toEqual([]);
    expect(failed(aboutChecks({ logoLoaded: null, version: '0.0.0', appVersion: '1.0.0' }))).toEqual(['about-logo', 'about-version']);
  });

  it('checks the wordmark sits inside the About card, only when there is one', () => {
    const base = { logoLoaded: true, version: '1.0.0', appVersion: '1.0.0' };
    expect(aboutChecks(base).map((check) => check.id)).not.toContain('about-wordmark-fits');
    expect(failed(aboutChecks({ ...base, wordmark: { left: 281, right: 729, cardLeft: 250, cardRight: 760 } }))).toEqual([]);
    const cut = aboutChecks({ ...base, wordmark: { left: 121, right: 889, cardLeft: 250, cardRight: 760 } });
    expect(reasonOf(cut, 'about-wordmark-fits')).toBe('the wordmark overflows the About card, 129 px past its left edge and 129 px past its right edge, so it is cut');
  });
});
