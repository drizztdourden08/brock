/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { existsSync } from 'fs';
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { crc32, deflateSync } from 'zlib';
import { parseBaselineConfig } from '@drizztdourden08/brock-core/review';
import type { MaskRect, ReviewBitmap, ReviewStepRecord } from '@drizztdourden08/brock-core/review';
import { createAutomationFlags } from '@drizztdourden08/brock-core/automation';
import { blessBaselines } from '../src/main/review/baselines/bless-baselines';
import { compareBaselines } from '../src/main/review/baselines/compare-baselines';
import type { BaselineOptions } from '../src/main/review/baselines/baseline-options.type';
import { readBaselineOptions } from '../src/main/review/baselines/read-baseline-options';
import { decodePng } from '../src/main/review/png/decode-png';
import { encodePng } from '../src/main/review/png/encode-png';

const image = (width: number, height: number, seed = 0): ReviewBitmap => {
  const data = new Uint8Array(width * height * 4);
  for (let at = 0; at < data.length; at += 1) data[at] = (at * 37 + seed) % 256;
  return { width, height, data };
};

const chunk = (type: string, data: Uint8Array): Buffer => {
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const head = Buffer.alloc(4);
  head.writeUInt32BE(data.length);
  const tail = Buffer.alloc(4);
  tail.writeUInt32BE(crc32(body));
  return Buffer.concat([head, body, tail]);
};

const paeth = (a: number, b: number, c: number): number => {
  const p = a + b - c;
  const [pa, pb, pc] = [Math.abs(p - a), Math.abs(p - b), Math.abs(p - c)];
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
};

const PREDICT = [
  (): number => 0,
  (a: number): number => a,
  (_a: number, b: number): number => b,
  (a: number, b: number): number => Math.floor((a + b) / 2),
  paeth,
];

const byteAt = (bytes: Uint8Array, index: number, present: boolean): number => (present ? bytes[index] ?? 0 : 0);

const filterRow = (rows: Uint8Array, raw: Buffer, y: number, { stride, channels }: { stride: number; channels: number }): void => {
  const filter = y % PREDICT.length;
  raw[y * (stride + 1)] = filter;
  for (let x = 0; x < stride; x += 1) {
    const at = y * stride + x;
    const predicted = PREDICT[filter]?.(byteAt(rows, at - channels, x >= channels), byteAt(rows, at - stride, y > 0), byteAt(rows, at - stride - channels, y > 0 && x >= channels)) ?? 0;
    raw[y * (stride + 1) + 1 + x] = (byteAt(rows, at, true) - predicted) & 0xff;
  }
};

const filteredPng = (rows: Uint8Array, width: number, height: number, channels: 3 | 4): Buffer => {
  const stride = width * channels;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) filterRow(rows, raw, y, { stride, channels });
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header.set([8, channels === 4 ? 6 : 2, 0, 0, 0], 8);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([signature, chunk('IHDR', header), chunk('IDAT', deflateSync(raw)), chunk('IEND', new Uint8Array(0))]);
};

describe('the review PNG codec', () => {
  it('reads back what it writes', () => {
    const source = image(7, 5);
    expect(decodePng(encodePng(source))).toEqual(source);
  });

  it('reads every row filter, in RGBA and RGB', () => {
    const rgba = image(6, 10, 3);
    expect(decodePng(filteredPng(rgba.data, 6, 10, 4)).data).toEqual(rgba.data);
    const rgb = image(5, 10, 9).data.subarray(0, 5 * 10 * 3);
    const decoded = decodePng(filteredPng(rgb, 5, 10, 3)).data;
    expect([...decoded.subarray(0, 8)]).toEqual([...rgb.subarray(0, 3), 255, ...rgb.subarray(3, 6), 255]);
  });

  it('refuses a file that is not a PNG', () => {
    expect(() => decodePng(Buffer.from('not a png at all'))).toThrow(/not a PNG/);
  });
});

describe('bless and compare', () => {
  let root = '';
  let reviewDir = '';
  let options: BaselineOptions;
  const masks = new Map<string, MaskRect[]>();
  const steps: ReviewStepRecord[] = [
    { index: 0, name: 'splash', file: '00-splash.png' },
    { index: 1, name: 'menu', file: '01-menu.png' },
    { index: 2, name: 'menu', file: '02-menu.png' },
  ];
  const input = (finished = true, list = steps): Parameters<typeof compareBaselines>[1] =>
    ({ steps: list, reviewDir, finished, masksOf: (file) => masks.get(file) ?? [], settled: (file) => file !== '02-menu.png' });
  const capture = (file: string, bitmap: ReviewBitmap): Promise<void> => writeFile(join(reviewDir, file), encodePng(bitmap));

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), 'brock-baselines-'));
    reviewDir = join(root, 'Data', 'review', 'review');
    await mkdir(reviewDir, { recursive: true });
    options = { mode: 'compare', root: join(root, 'tests', 'baselines'), setDir: join(root, 'tests', 'baselines', 'linux'), setLabel: 'tests/baselines/linux', platform: 'linux', config: parseBaselineConfig(undefined) };
    masks.clear();
    await Promise.all(steps.map((step, index) => capture(step.file, image(8, 6, index))));
  });

  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  it('blesses the captures under names without step numbers, then the same run matches', async () => {
    const blessed = await blessBaselines({ ...options, mode: 'bless' }, input());
    expect(blessed.results.map((result) => result.status)).toEqual(['blessed', 'blessed', 'blessed']);
    expect((await readdir(options.setDir)).sort()).toEqual(['menu--2.png', 'menu.png', 'splash.png']);
    const compared = await compareBaselines(options, input());
    expect(compared.results.map((result) => result.status)).toEqual(['match', 'match', 'match']);
  });

  it('fails a changed pixel and writes its diff image, unless a mask or the tolerance covers it', async () => {
    await blessBaselines({ ...options, mode: 'bless' }, input());
    const changed = image(8, 6, 1);
    changed.data.set([1, 2, 3, 4], (2 * 8 + 5) * 4);
    await capture('01-menu.png', changed);
    const failed = (await compareBaselines(options, input())).results[1];
    expect(failed).toMatchObject({ capture: 'menu', status: 'differs', diffPixels: 1, diff: 'diffs/01-menu.png' });
    expect(decodePng(await readFile(join(reviewDir, 'diffs', '01-menu.png'))).width).toBe(8);

    masks.set('01-menu.png', [{ x: 5, y: 2, width: 1, height: 1 }]);
    expect((await compareBaselines(options, input())).results[1]).toMatchObject({ status: 'match', masked: 1 });
    masks.clear();

    const tolerant = { ...options, config: parseBaselineConfig({ captures: { menu: { tolerance: 0.05 } } }) };
    expect((await compareBaselines(tolerant, input())).results[1]?.status).toBe('match');

    await capture('02-menu.png', image(8, 6, 7));
    expect((await compareBaselines(options, input())).results[2]).toMatchObject({ capture: 'menu--2', status: 'differs', settled: false });
  });

  it('reports a missing baseline, a size change and a baseline no capture used', async () => {
    await blessBaselines({ ...options, mode: 'bless' }, input(true, steps.slice(0, 2)));
    await capture('01-menu.png', image(9, 6, 1));
    await writeFile(join(options.setDir, 'old-screen.png'), encodePng(image(2, 2)));
    const results = (await compareBaselines(options, input())).results.map((result) => [result.capture, result.status]);
    expect(results).toEqual([['splash', 'match'], ['menu', 'size'], ['menu--2', 'missing'], ['old-screen', 'unused']]);
    const stopped = (await compareBaselines(options, input(false))).results.map((result) => result.status);
    expect(stopped).not.toContain('unused');
  });

  it('a finished bless removes the baselines nobody captured', async () => {
    await blessBaselines({ ...options, mode: 'bless' }, input());
    await blessBaselines({ ...options, mode: 'bless' }, input(true, steps.slice(0, 2)));
    expect(existsSync(join(options.setDir, 'menu--2.png'))).toBe(false);
  });
});

describe('readBaselineOptions', () => {
  const flags = createAutomationFlags();

  it('stays off without the review or a baseline flag', () => {
    expect(readBaselineOptions(flags, 'X:/app', ['--review'])).toBeNull();
    expect(readBaselineOptions(flags, 'X:/app', ['--review-baselines'])).toBeNull();
  });

  it('compares by default, blesses on request, and takes a folder', () => {
    const compare = readBaselineOptions(flags, '/app', ['--review', '--review-baselines']);
    expect(compare?.mode).toBe('compare');
    expect(compare?.root.replace(/\\/g, '/')).toMatch(/\/app\/tests\/baselines$/);
    expect(compare?.setLabel).toBe(`tests/baselines/${compare?.platform ?? ''}`);
    const bless = readBaselineOptions(flags, '/app', ['--review', '--review-bless=shots']);
    expect(bless?.mode).toBe('bless');
    expect(bless?.setDir.replace(/\\/g, '/')).toMatch(/\/app\/shots\/[a-z0-9]+$/);
  });
});
