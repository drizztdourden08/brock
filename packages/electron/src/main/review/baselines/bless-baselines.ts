/* @layer electron-main @kind logic */
import { copyFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import type { BaselineReport, BaselineResult } from '@drizztdourden08/brock-core/review';
import type { BaselineOptions, BaselineRunInput } from './baseline-options.type';
import { capturedSteps } from './captured-steps';
import { PNG_EXTENSION } from './review-baselines.constants';
import { unusedBaselines } from './unused-baselines';

const blessBaselines = async (options: BaselineOptions, input: BaselineRunInput): Promise<BaselineReport> => {
  if (input.failedChecks.length > 0 && !options.force) {
    return { mode: 'bless', platform: options.platform, dir: options.setLabel, results: [], refused: [...input.failedChecks] };
  }
  const captured = capturedSteps(input.steps, input.reviewDir);
  await mkdir(options.setDir, { recursive: true });
  const results: BaselineResult[] = [];
  for (const { step, key } of captured) {
    await copyFile(join(input.reviewDir, step.file), join(options.setDir, `${key}${PNG_EXTENSION}`));
    results.push({ capture: key, step: step.name, file: step.file, status: 'blessed', diffPixels: 0, ratio: 0, tolerance: 0, masked: 0 });
  }
  const unused = await unusedBaselines(options.setDir, new Set(captured.map(({ key }) => key)), input.finished);
  for (const result of unused) await rm(join(options.setDir, result.file), { force: true });
  return { mode: 'bless', platform: options.platform, dir: options.setLabel, results: [...results, ...unused] };
};

export { blessBaselines };
