/* @layer core @kind logic */
import type { ReviewStepRecord } from './review.type';

const slugOf = (file: string): string => file.replace(/\.png$/i, '').replace(/^\d+-/, '');

const baselineKeys = (steps: readonly ReviewStepRecord[]): Map<string, string> => {
  const seen = new Map<string, number>();
  const keys = new Map<string, string>();
  for (const step of [...steps].sort((a, b) => a.index - b.index)) {
    const slug = slugOf(step.file);
    const count = (seen.get(slug) ?? 0) + 1;
    seen.set(slug, count);
    keys.set(step.file, count === 1 ? slug : `${slug}--${count}`);
  }
  return keys;
};

export { baselineKeys };
