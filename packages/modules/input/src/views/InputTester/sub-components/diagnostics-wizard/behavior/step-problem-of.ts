/* @layer renderer-shell @kind logic */
import { PROBLEMS } from '../diagnostics-wizard.constants';
import type { ProblemSource } from '../diagnostics-wizard.type';

const introProblem = (wizard: ProblemSource): string | null => {
  if (wizard.releaseStatus === 'pending') return PROBLEMS.releasing;
  if (wizard.releaseStatus === 'error') return PROBLEMS.releaseFailed;
  if (wizard.preselected && wizard.deviceKey === null) return PROBLEMS.missingPad;
  return null;
};

const stepProblemOf = (wizard: ProblemSource, capturedCount: number): string | null => {
  switch (wizard.step) {
    case 'intro': return introProblem(wizard);
    case 'choose-controller': return wizard.deviceKey === null ? PROBLEMS.pickPad : null;
    case 'byte-capture': return capturedCount === 0 ? PROBLEMS.needCapture : null;
    case 'positional-capture': return wizard.restoreStatus === 'done' ? null : PROBLEMS.restoring;
    case 'summary': return null;
  }
};

export { stepProblemOf };
