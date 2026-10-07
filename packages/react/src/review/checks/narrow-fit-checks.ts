/* @layer renderer-shell @kind logic */
import type { NarrowFitSnapshot, ReviewOutcome } from '../review.type';
import { outcome } from './outcome';

const narrowFitChecks = (id: string, snapshot: NarrowFitSnapshot): ReviewOutcome[] => {
  const { width, cutTitles, sideScroll } = snapshot;
  const problems = [
    ...cutTitles.map((title) => `the title "${title}" is cut`),
    ...(sideScroll ? ['its content scrolls sideways'] : []),
  ];
  return [
    outcome(
      `${id}-fits-narrow`,
      problems.length === 0,
      `"${id}" fits a ${width} px wide window: no title cut, no sideways scroll`,
      `in a ${width} px wide window "${id}" does not fit: ${problems.join('; ')}`,
    ),
  ];
};

export { narrowFitChecks };
