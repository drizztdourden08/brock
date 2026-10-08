/* @layer electron-main @kind logic */
import type { BaselineReport, BaselineResult, ReviewStepRecord } from '@drizztdourden08/brock-core/review';
import type { BaselineOptions, BaselineRunInput } from './baseline-options.type';
import { capturedSteps } from './captured-steps';
import { compareCapture } from './compare-capture';
import { unusedBaselines } from './unused-baselines';

const safely = async (step: ReviewStepRecord, key: string, options: BaselineOptions, input: BaselineRunInput): Promise<BaselineResult> => {
  try {
    return await compareCapture(step, key, options, input);
  } catch (err) {
    const detail = `could not compare: ${err instanceof Error ? err.message : String(err)}`;
    return { capture: key, step: step.name, file: step.file, status: 'differs', diffPixels: 0, ratio: 0, tolerance: 0, masked: 0, detail };
  }
};

const compareBaselines = async (options: BaselineOptions, input: BaselineRunInput): Promise<BaselineReport> => {
  const captured = capturedSteps(input.steps, input.reviewDir);
  const results: BaselineResult[] = [];
  for (const { step, key } of captured) results.push(await safely(step, key, options, input));
  const unused = await unusedBaselines(options.setDir, new Set(captured.map(({ key }) => key)), input.finished);
  return { mode: 'compare', platform: options.platform, dir: options.setLabel, results: [...results, ...unused] };
};

export { compareBaselines };
