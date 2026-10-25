/* @layer renderer-shell @kind logic */
import type { AdvanceSource } from '../diagnostics-wizard.type';

const advanceOf = (wizard: AdvanceSource, onByteCaptureNext: () => void): (() => void) => {
  const { step, preselected, confirmChoice, goNext } = wizard;
  if (step === 'byte-capture') return onByteCaptureNext;
  if (step === 'choose-controller' || (step === 'intro' && preselected)) {
    return () => { void confirmChoice(); };
  }
  return goNext;
};

export { advanceOf };
