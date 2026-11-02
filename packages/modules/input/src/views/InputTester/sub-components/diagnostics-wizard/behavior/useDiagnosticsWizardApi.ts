/* @layer renderer-shell @kind hook */
import { useCallback, useMemo } from 'react';
import type { WizardApi, WizardStepDef } from '@drizztdourden08/tessera/composites';
import type { DiagnosticsApiInput, DiagnosticsValues } from '../diagnostics-wizard.type';
import { NO_ERRORS } from '../diagnostics-wizard.constants';
import { advanceOf } from './advance-of';
import { diagnosticsStepDefs } from './diagnostics-step-defs';
import { isWizardBusy } from './is-wizard-busy';
import { stepProblemOf } from './step-problem-of';

const useDiagnosticsWizardApi = (input: DiagnosticsApiInput): WizardApi<DiagnosticsValues> => {
  const { wizard, capturedCount, summaryActions, finishLook, onByteCaptureNext, onFinish } = input;
  const { step, steps, deviceKey, setDeviceKey, goBack } = wizard;

  const defs = useMemo(
    () => diagnosticsStepDefs({ steps, summaryActions, finishLook }),
    [steps, summaryActions, finishLook],
  );
  const index = Math.max(0, defs.findIndex((def) => def.id === step));
  const current: WizardStepDef<DiagnosticsValues> | undefined = defs[index];
  const invalid = stepProblemOf(wizard, capturedCount);
  const busy = isWizardBusy(wizard);
  const goNext = useMemo(() => advanceOf(wizard, onByteCaptureNext), [wizard, onByteCaptureNext]);
  const values = useMemo<DiagnosticsValues>(() => ({ deviceKey }), [deviceKey]);
  const visited = useMemo(() => defs.slice(0, index + 1).map((def) => def.id), [defs, index]);
  const setValue = useCallback((_key: 'deviceKey', value: string | null) => setDeviceKey(value), [setDeviceKey]);
  const update = useCallback((patch: Partial<DiagnosticsValues>) => {
    if (patch.deviceKey !== undefined) setDeviceKey(patch.deviceKey);
  }, [setDeviceKey]);
  const finish = useCallback(() => {
    onFinish();
    return Promise.resolve();
  }, [onFinish]);

  return useMemo((): WizardApi<DiagnosticsValues> => {
    if (!current) throw new Error('The diagnostics wizard needs at least one step.');
    return {
      steps: defs, current, index, isFirst: index === 0, isLast: index === defs.length - 1,
      invalid, hint: invalid, canGoTo: () => false,
      values, visited, errors: NO_ERRORS, dirty: false, busy,
      setValue, update, setError: () => undefined,
      goNext, goBack, goTo: () => undefined, finish, reset: () => undefined,
    };
  }, [defs, current, index, invalid, busy, values, visited, setValue, update, goNext, goBack, finish]);
};

export { useDiagnosticsWizardApi };
