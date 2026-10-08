/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { baselineChecks } from '../src/review/baseline-checks';
import { baselineKeys } from '../src/review/baseline-keys';
import type { BaselineReport, ReviewBitmap } from '../src/review/baseline.type';
import { buildReviewReport } from '../src/review/build-review-report';
import { compareBitmaps } from '../src/review/compare-bitmaps';
import { maskGrid } from '../src/review/mask-grid';
import { parseBaselineConfig } from '../src/review/parse-baseline-config';
import { renderReviewMarkdown } from '../src/review/render-review-markdown';
import { resolveBaselineRule } from '../src/review/resolve-baseline-rule';
import type { ReviewRun } from '../src/review/review.type';

const bitmap = (width: number, height: number, rgba: readonly number[] = [10, 20, 30, 255]): ReviewBitmap => {
  const data = new Uint8Array(width * height * 4);
  for (let at = 0; at < data.length; at += 4) data.set(rgba, at);
  return { width, height, data };
};

const withPixel = (source: ReviewBitmap, x: number, y: number, rgba: readonly number[]): ReviewBitmap => {
  const data = source.data.slice();
  data.set(rgba, (y * source.width + x) * 4);
  return { ...source, data };
};

const pixelOf = (image: ReviewBitmap, x: number, y: number): number[] => [...image.data.subarray((y * image.width + x) * 4, (y * image.width + x) * 4 + 4)];

const NONE: string[] = [];

const RUN: ReviewRun = {
  windowIcon: 'app.png',
  startedAt: 0,
  name: 'baselines',
  app: { electron: '42.1.0', version: '2.0.0', name: 'Shots' },
  steps: [{ index: 1, name: 'boot', file: '01-boot.png' }],
  checks: [],
  mainLog: [],
  consoleErrors: NONE,
  failedLoads: NONE,
};

const RESULT = { step: 'boot', file: '01-boot.png', diffPixels: 0, ratio: 0, tolerance: 0, masked: 0 };

describe('compareBitmaps', () => {
  it('finds no difference between equal images and fades them in the diff', () => {
    const result = compareBitmaps(bitmap(4, 3), bitmap(4, 3), []);
    expect(result).toMatchObject({ diffPixels: 0, comparedPixels: 12, ratio: 0 });
    expect(pixelOf(result.diff, 0, 0)[3]).toBe(255);
  });

  it('counts a single changed channel as a changed pixel and paints it', () => {
    const current = withPixel(bitmap(4, 3), 2, 1, [10, 20, 31, 255]);
    const result = compareBitmaps(bitmap(4, 3), current, []);
    expect(result.diffPixels).toBe(1);
    expect(result.ratio).toBeCloseTo(1 / 12);
    expect(pixelOf(result.diff, 2, 1)).toEqual([255, 0, 64, 255]);
    expect(pixelOf(result.diff, 1, 1)).not.toEqual([255, 0, 64, 255]);
  });

  it('ignores the pixels under a mask and leaves them out of the share', () => {
    const current = withPixel(bitmap(4, 3), 2, 1, [0, 0, 0, 0]);
    const result = compareBitmaps(bitmap(4, 3), current, [{ x: 2, y: 1, width: 1, height: 1 }]);
    expect(result).toMatchObject({ diffPixels: 0, comparedPixels: 11 });
    expect(pixelOf(result.diff, 2, 1)).toEqual([64, 128, 255, 255]);
  });

  it('lets a channel threshold pass small colour drift but not a larger one', () => {
    const drifted = withPixel(withPixel(bitmap(4, 3), 0, 0, [12, 20, 30, 255]), 1, 0, [13, 20, 30, 255]);
    expect(compareBitmaps(bitmap(4, 3), drifted, [], 2).diffPixels).toBe(1);
    expect(compareBitmaps(bitmap(4, 3), drifted, []).diffPixels).toBe(2);
  });

  it('refuses images of different sizes', () => {
    expect(() => compareBitmaps(bitmap(4, 3), bitmap(3, 4), [])).toThrow(/sizes differ/);
  });
});

describe('maskGrid', () => {
  it('rounds a fractional rect outward and clamps it to the image', () => {
    const grid = maskGrid(4, 2, [{ x: 0.5, y: 0.5, width: 1, height: 0.2 }, { x: 3, y: -5, width: 10, height: 6 }]);
    expect([...grid]).toEqual([1, 1, 0, 1, 0, 0, 0, 0]);
  });
});

describe('parseBaselineConfig and resolveBaselineRule', () => {
  it('defaults to zero tolerance and the mask attribute', () => {
    const rule = resolveBaselineRule(parseBaselineConfig(undefined), 'screen-home');
    expect(rule).toMatchObject({ tolerance: 0, threshold: 0, rects: [] });
    expect(rule.selectors.slice(0, 2)).toEqual(['[data-review-mask]', '.logs-widget .log-panel__gutter']);
    expect(rule.selectors.some((selector) => selector.includes('[data-storage-page]'))).toBe(true);
  });

  it('merges the global masks with the capture rule and keeps its tolerance and threshold', () => {
    const config = parseBaselineConfig({
      threshold: 1,
      masks: [{ selector: '.clock' }],
      captures: { 'screen-home': { tolerance: 0.01, threshold: 3, masks: [{ x: 1, y: 2, width: 3, height: 4 }] } },
    });
    const rule = resolveBaselineRule(config, 'screen-home');
    expect(rule).toMatchObject({ tolerance: 0.01, threshold: 3, rects: [{ x: 1, y: 2, width: 3, height: 4 }] });
    expect(rule.selectors.at(-1)).toBe('.clock');
    expect(resolveBaselineRule(config, 'about')).toMatchObject({ tolerance: 0, threshold: 1 });
  });

  it('gives cluster-fullscreen a built-in channel threshold of 8 and no pixel share, which the app can override', () => {
    expect(resolveBaselineRule(parseBaselineConfig(undefined), 'cluster-fullscreen')).toMatchObject({ tolerance: 0, threshold: 8 });
    expect(resolveBaselineRule(parseBaselineConfig({ tolerance: 0.5, threshold: 2 }), 'cluster-fullscreen')).toMatchObject({ tolerance: 0, threshold: 8 });
    const tightened = parseBaselineConfig({ captures: { 'cluster-fullscreen': { threshold: 0 } } });
    expect(resolveBaselineRule(tightened, 'cluster-fullscreen')).toMatchObject({ tolerance: 0, threshold: 0 });
    const shifted = withPixel(bitmap(4, 3), 1, 1, [18, 28, 38, 255]);
    const moved = withPixel(bitmap(4, 3), 1, 1, [19, 20, 30, 255]);
    expect(compareBitmaps(bitmap(4, 3), shifted, [], 8).diffPixels).toBe(0);
    expect(compareBitmaps(bitmap(4, 3), moved, [], 8).diffPixels).toBe(1);
  });

  it('names the bad field', () => {
    expect(() => parseBaselineConfig({ tolerance: 2 })).toThrow(/tolerance/);
    expect(() => parseBaselineConfig({ threshold: 1.5 })).toThrow(/threshold/);
    expect(() => parseBaselineConfig({ captures: { a: { masks: [{ x: 1 }] } } })).toThrow(/captures\.a\.masks\[0\]/);
    expect(() => parseBaselineConfig([])).toThrow(/JSON object/);
  });
});

describe('baselineKeys', () => {
  it('drops the step number and tells repeated names apart', () => {
    const keys = baselineKeys([
      { index: 2, name: 'menu', file: '02-menu.png' },
      { index: 0, name: 'splash', file: '00-splash.png' },
      { index: 5, name: 'menu', file: '05-menu.png' },
    ]);
    expect([...keys.values()]).toEqual(['splash', 'menu', 'menu--2']);
    expect(keys.get('05-menu.png')).toBe('menu--2');
  });
});

describe('baselineChecks and the report', () => {
  const report = (results: BaselineReport['results'], mode: BaselineReport['mode'] = 'compare'): BaselineReport =>
    ({ mode, platform: 'windows', dir: 'tests/baselines/windows', results });

  it('passes when every capture matches', () => {
    const checks = baselineChecks(report([{ ...RESULT, capture: 'boot', status: 'match' }]));
    expect(checks).toEqual([expect.objectContaining({ id: 'baselines', pass: true })]);
  });

  it('fails the review once per failed capture and lists them in report.md and report.json', () => {
    const baselines = report([
      { ...RESULT, capture: 'boot', status: 'differs', diffPixels: 12, ratio: 0.5, diff: 'diffs/01-boot.png' },
      { ...RESULT, capture: 'menu', status: 'missing' },
      { ...RESULT, capture: 'gone', step: 'global', status: 'unused' },
    ]);
    const built = buildReviewReport({ ...RUN, baselines }, { finished: true, finishedAt: 2_000 });
    expect(built.passed).toBe(false);
    expect(built.baselines?.results).toHaveLength(3);
    expect(built.checks.filter((check) => check.id === 'baseline').map((check) => check.reason)).toEqual([
      '"boot" differs from the windows baseline in 12 pixels (50.000%, tolerance 0.000%); diff image diffs/01-boot.png',
      '"menu" has no windows baseline; bless the set with --review-bless',
      'the windows baseline "gone" was not captured in this run',
    ]);
    const markdown = renderReviewMarkdown(built);
    expect(markdown).toContain('## Baselines');
    expect(markdown).toContain('| boot | boot | differs | 12 | 50.000% | diffs/01-boot.png |');
  });

  it('a bless passes and says what it wrote and removed', () => {
    const checks = baselineChecks(report([{ ...RESULT, capture: 'boot', status: 'blessed' }, { ...RESULT, capture: 'gone', status: 'unused' }], 'bless'));
    expect(checks).toHaveLength(1);
    expect(checks[0]).toMatchObject({ id: 'baselines', pass: true });
    expect(checks[0]?.reason).toContain('blessed 1 captures');
    expect(checks[0]?.reason).toContain('removed 1');
  });

  it('fails a refused bless, naming the checks that failed, in both reports', () => {
    const baselines = { ...report([], 'bless'), refused: ['fonts-loaded (fonts)', 'tour-finished (global)'] };
    const checks = baselineChecks(baselines);
    expect(checks).toHaveLength(1);
    expect(checks[0]).toMatchObject({ id: 'baselines', pass: false });
    expect(checks[0]?.reason).toContain('2 other checks failed (fonts-loaded (fonts), tour-finished (global))');
    expect(checks[0]?.reason).toContain('--review-bless --force');
    const markdown = renderReviewMarkdown(buildReviewReport({ ...RUN, baselines }, { finished: true, finishedAt: 2_000 }));
    expect(markdown).toContain('Did not bless the windows set');
    expect(markdown).toContain('- tour-finished (global)');
  });

  it('fails a compare that found no capture at all', () => {
    expect(baselineChecks(report([]))[0]?.pass).toBe(false);
  });
});
