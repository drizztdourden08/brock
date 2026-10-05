/* @layer renderer-shell @kind test */
import { describe, expect, it, vi } from 'vitest';
import type { AppReview, ReviewStepDef } from '../src/review/app-review.type';
import type { ReviewEnv, ReviewOutcome, StepTour } from '../src/review/review.type';

vi.mock('../src/review/app/app-tour', () => ({
  appTour: (tour: StepTour, id: string) => ({ ...tour, id, capture: (name: string) => tour.capture(`${id}-${name}`) }),
}));

const { appSteps } = await import('../src/review/app/app-steps');
const { seedSteps } = await import('../src/review/app/seed-steps');

const recordingTour = () => {
  const checks: ReviewOutcome[] = [];
  const captures: string[] = [];
  const tour: StepTour = {
    env: {} as ReviewEnv,
    report: (outcomes) => { checks.push(...outcomes); },
    check: (id, pass, passReason, failReason) => { checks.push({ id, pass, reason: pass ? passReason : failReason }); },
    capture: (name) => { captures.push(name); return Promise.resolve(); },
  };
  return { tour, checks, captures };
};

const stepModule = (def: ReviewStepDef) => () => Promise.resolve({ default: def });

const REVIEW: AppReview = {
  seed: stepModule({ run: (tour) => { tour.check('seeded', true, 'seeded', ''); return Promise.resolve(); } }),
  steps: [
    { id: 'dashboard', load: stepModule({ run: async (tour) => { await tour.capture('home'); tour.check('tiles', true, 'six tiles', ''); } }) },
    { id: 'menu', load: stepModule({ run: () => Promise.resolve() }) },
  ],
};

describe('app review steps', () => {
  it('runs the seed as the seed step, and nothing when the app has none', async () => {
    expect(seedSteps(null)).toEqual([]);
    expect(seedSteps({ seed: null, steps: [] })).toEqual([]);
    const [seed] = seedSteps(REVIEW);
    expect(seed?.name).toBe('seed');
    const { tour, checks } = recordingTour();
    await seed?.run(tour);
    expect(checks.map((c) => c.id)).toEqual(['seeded', 'step-ran']);
    expect(checks[1]?.reason).toContain('src/review/seed.ts');
  });

  it('copies src/review/fixtures into the data folder before the seed runs, even with no seed', async () => {
    const written: string[] = [];
    vi.stubGlobal('fetch', (url: string) => Promise.resolve(new Response(url === 'missing' ? null : `body of ${url}`, { status: url === 'missing' ? 404 : 200 })));
    const fixture = (path: string, url: string) => ({ path, load: () => Promise.resolve({ default: url }) });
    const files = { writeBytes: (path: string, data: Uint8Array) => { written.push(`${path}=${new TextDecoder().decode(data)}`); return Promise.resolve(); } };
    const [seed] = seedSteps({ ...REVIEW, fixtures: [fixture('sessions/review.json', '/assets/review.json'), fixture('logs/run.log', '/assets/run.log')] });
    const { tour, checks } = recordingTour();
    await seed?.run({ ...tour, platform: { files } } as StepTour);
    expect(written).toEqual(['sessions/review.json=body of /assets/review.json', 'logs/run.log=body of /assets/run.log']);
    expect(checks.map((c) => `${c.id}:${String(c.pass)}`)).toEqual(['fixtures-copied:true', 'seeded:true', 'step-ran:true']);
    const [only] = seedSteps({ seed: null, steps: [], fixtures: [fixture('gone.txt', 'missing')] });
    const failed = recordingTour();
    await only?.run({ ...failed.tour, platform: { files } } as StepTour);
    expect(failed.checks).toEqual([{ id: 'fixtures-copied', pass: false, reason: expect.stringContaining('gone.txt: 404') as string }]);
    vi.unstubAllGlobals();
  });

  it('names each step by its file, prefixes its captures and refuses a built-in name', async () => {
    const steps = appSteps(REVIEW, new Set(['boot', 'menu']));
    expect(steps.map((step) => step.name)).toEqual(['dashboard', 'menu']);
    const dashboard = recordingTour();
    await steps[0]?.run(dashboard.tour);
    expect(dashboard.captures).toEqual(['dashboard-home']);
    expect(dashboard.checks.map((c) => c.id)).toEqual(['tiles', 'step-ran']);
    const clash = recordingTour();
    await steps[1]?.run(clash.tour);
    expect(clash.checks).toEqual([{ id: 'step-id', pass: false, reason: expect.stringContaining('src/review/menu.step.ts') as string }]);
  });
});
