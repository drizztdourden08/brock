/* @layer electron-main @kind logic */
import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { BASELINE_DIFF_DIR, compareBitmaps, resolveBaselineRule } from '@drizztdourden08/brock-core/review';
import type { BaselineResult, ReviewStepRecord } from '@drizztdourden08/brock-core/review';
import { decodePng } from '../png/decode-png';
import { encodePng } from '../png/encode-png';
import type { BaselineOptions, BaselineRunInput } from './baseline-options.type';
import { PNG_EXTENSION } from './review-baselines.constants';

const compareCapture = async (step: ReviewStepRecord, key: string, options: BaselineOptions, input: BaselineRunInput): Promise<BaselineResult> => {
  const rule = resolveBaselineRule(options.config, key);
  const base = { capture: key, step: step.name, file: step.file, diffPixels: 0, ratio: 0, tolerance: rule.tolerance, masked: 0 };
  const baselinePath = join(options.setDir, `${key}${PNG_EXTENSION}`);
  if (!existsSync(baselinePath)) return { ...base, status: 'missing' };
  const [baseline, current] = (await Promise.all([readFile(baselinePath), readFile(join(input.reviewDir, step.file))])).map(decodePng);
  if (!baseline || !current) return { ...base, status: 'missing' };
  if (baseline.width !== current.width || baseline.height !== current.height) {
    return { ...base, status: 'size', detail: `the baseline is ${baseline.width}x${baseline.height}, the capture ${current.width}x${current.height}` };
  }
  const result = compareBitmaps(baseline, current, [...rule.rects, ...input.masksOf(step.file)], rule.threshold);
  const measured = { ...base, diffPixels: result.diffPixels, ratio: result.ratio, masked: current.width * current.height - result.comparedPixels };
  if (result.ratio <= rule.tolerance) return { ...measured, status: 'match' };
  const diff = `${BASELINE_DIFF_DIR}/${step.file}`;
  await mkdir(join(input.reviewDir, BASELINE_DIFF_DIR), { recursive: true });
  await writeFile(join(input.reviewDir, diff), encodePng(result.diff));
  return { ...measured, status: 'differs', diff, ...(input.settled(step.file) ? {} : { settled: false }) };
};

export { compareCapture };
