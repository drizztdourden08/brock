/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Profile } from '@drizztdourden08/brock-core';
import type { HubDef, HubPage } from '../src/hub/hub.type';
import type { ResolvedScreenTree } from '../src/screens/conventions/screen-tree.type';
import type { ReviewEnv, ReviewOutcome } from '../src/review/review.type';
import { recordingTour } from './review-outcomes';

const seen = vi.hoisted(() => ({ profile: 'Starter', opened: [] as string[] }));

vi.mock('../src/screens/show/current-show-context', () => ({
  currentShowContext: () => ({ profile: { id: seen.profile, name: seen.profile } as Profile, host: 'electron', formFactor: 'desktop', flags: {} }),
}));
vi.mock('../src/review/steps/reset-ui', () => ({ resetUi: () => Promise.resolve() }));
vi.mock('../src/review/steps/visit-hub-pages', () => ({ visitHubPages: () => Promise.resolve() }));
vi.mock('../src/review/steps/hub-back-check', () => ({ hubBackCheck: () => Promise.resolve() }));
vi.mock('../src/review/dom/wait-for', () => ({ waitFor: () => Promise.resolve(true) }));
vi.mock('../src/review/steps/open-bucket', () => ({
  openBucket: (_env: ReviewEnv, hub: HubDef) => {
    seen.opened.push(hub.id);
    return Promise.resolve('the bucket switch');
  },
}));

const { bucketsStep } = await import('../src/review/steps/buckets-step');

const page = (id: string): HubPage => ({ id, label: id, icon: null, render: () => null });

const hub = (id: string, show?: HubDef['show']): HubDef => ({ id, title: id, icon: null, home: page(`${id}-home`), groups: [], nav: false, show });

const TREE: Partial<ResolvedScreenTree> = {
  home: 'play',
  base: null,
  hubs: [hub('play'), hub('league', { when: ({ profile }) => profile?.name === 'Pro' })],
  screens: [],
};

const runStep = async (): Promise<ReviewOutcome[]> => {
  const { tour, checks } = recordingTour({ screenTree: TREE as ResolvedScreenTree, homeScreen: 'play', menu: [], menuOverrides: [], developerTools: false });
  await bucketsStep.run(tour);
  return checks.filter((check) => check.id.startsWith('league-'));
};

afterEach(() => {
  seen.opened.length = 0;
  seen.profile = 'Starter';
});

describe('the buckets step and show rules', () => {
  it('skips a bucket whose when is false for the active profile, and says why', async () => {
    const league = await runStep();
    expect(seen.opened).toEqual(['play']);
    expect(league.map((check) => `${check.id}:${String(check.pass)}`)).toEqual(['league-reachable:true', 'league-pages:true']);
    expect(league[0]?.reason).toContain('skipped: bucket "league" is hidden');
  });

  it('tours the same bucket when the active profile shows it', async () => {
    seen.profile = 'Pro';
    const league = await runStep();
    expect(seen.opened).toEqual(['play', 'league']);
    expect(league.find((check) => check.id === 'league-reachable')?.reason).toBe('bucket "league" opens from the bucket switch');
  });
});
