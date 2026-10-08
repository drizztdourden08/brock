/* @layer tooling-scripts @kind test */
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { reviewDataDir } from '../src/launch/review-data.mjs';

const root = mkdtempSync(join(tmpdir(), 'brock-review-data-'));
const userData = join(root, '.user-data');

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

describe('reviewDataDir', () => {
  it('keeps the data folder for a launch or a review without baselines', () => {
    expect(reviewDataDir([], userData)).toBe(userData);
    expect(reviewDataDir(['--review'], userData)).toBe(userData);
    expect(reviewDataDir(['--review-bless'], userData)).toBe(userData);
  });

  it('gives a baseline review an emptied folder beside it, every time', () => {
    mkdirSync(join(`${userData}-review`, 'Data'), { recursive: true });
    writeFileSync(join(`${userData}-review`, 'Data', 'app.json'), '{}');
    expect(reviewDataDir(['--review', '--review-baselines'], userData)).toBe(`${userData}-review`);
    expect(readdirSync(`${userData}-review`)).toEqual([]);
    expect(reviewDataDir(['--review=nightly', '--review-bless=shots'], userData)).toBe(`${userData}-review`);
    expect(existsSync(userData)).toBe(false);
  });
});
