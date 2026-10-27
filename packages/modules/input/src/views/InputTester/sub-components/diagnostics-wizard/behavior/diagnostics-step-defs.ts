/* @layer renderer-shell @kind logic */
import type { WizardStepDef } from '@drizztdourden08/tessera/composites';
import { BUSY_HINTS } from '../diagnostics-wizard.constants';
import type { DiagnosticsStepDefsInput, DiagnosticsValues } from '../diagnostics-wizard.type';

const diagnosticsStepDefs = (input: DiagnosticsStepDefsInput): WizardStepDef<DiagnosticsValues>[] => {
  const { steps, summaryActions, finishLook } = input;
  const last = steps.length - 1;
  return steps.map((info, index): WizardStepDef<DiagnosticsValues> => ({
    id: info.step,
    label: info.label,
    busyHint: BUSY_HINTS[info.step],
    buttons: {
      ...(index === 0 ? { back: false as const } : {}),
      ...(index === last ? { next: finishLook } : {}),
    },
    ...(info.step === 'summary' ? { extra: () => summaryActions } : {}),
  }));
};

export { diagnosticsStepDefs };
